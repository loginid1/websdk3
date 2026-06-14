// Copyright (C) LoginID

import { exportPublicKeyJwk, generateES256KeyPair } from "../utils/crypto";
import { signJwtWithJwk, toTrustIDPayload } from "../helpers";
import { IndexedDBWrapper } from "./indexdb";
import { StorageError } from "../errors";
import { TrustIDRecord } from "../types";

const dbVersion = 1;
const appIdIndex = "app_id_idx";
const nameIndex = "username_idx";
const dbName = "LoginIDTrustStore";
const trustStorageKey = `trust-id`;
const appIdUsernameCompositeIndex = "app_id_username_idx";
const lastUsedAtIndex = "last_used_at_idx";

/**
 * TrustStore extends IndexedDBWrapper to manage trust ID records.
 */
export class TrustStore extends IndexedDBWrapper {
  /** App ID associated with this store */
  private readonly appId: string;

  /**
   * Creates an instance of TrustStore.
   * @param {string} appId - The app ID.
   */
  constructor(appId: string) {
    super(dbName, dbVersion, trustStorageKey, [
      { name: nameIndex, keyPath: ["username"] },
      { name: appIdIndex, keyPath: ["appId"] },
      { name: appIdUsernameCompositeIndex, keyPath: ["appId", "username"] },
      { name: lastUsedAtIndex, keyPath: ["lastUsedAt"] },
    ]);
    this.appId = appId;
  }

  /**
   * Marks the latest trust ID in storage as valid.
   *
   * @returns {Promise<void>} A promise that resolves when the record is updated.
   * @throws {StorageError} If no record is found or the update fails.
   */
  public async markTrustIdAsValid(): Promise<void> {
    try {
      const record = await this.getLatestUsedTrustIdRecord();
      record.valid = true;
      await this.putRecord(record);
    } catch {
      throw new StorageError(
        "Failed to mark trust ID as valid.",
        "ERROR_STORAGE_FAILED",
      );
    }
  }

  /**
   * Checks whether the stored trust ID is marked as valid.
   *
   * @returns {Promise<boolean>} True if the trust ID is valid, false otherwise.
   * @throws {StorageError} If no record is found or access fails.
   */
  public async isTrustIdValid(): Promise<boolean> {
    try {
      const record = await this.getLatestUsedTrustIdRecord();
      return record && record.valid === true;
    } catch (error) {
      if (
        error instanceof StorageError &&
        error.code === "ERROR_STORAGE_NOT_FOUND"
      ) {
        return false;
      }
      throw new StorageError(
        "Failed to check trust ID validity.",
        "ERROR_STORAGE_FAILED",
      );
    }
  }

  /**
   * Retrieves the latest used Trust ID record.
   *
   * @returns {Promise<TrustIDRecord>} A promise that resolves to the latest used trust ID record.
   * @throws {StorageError} If no record is found or access fails.
   */
  public async getLatestUsedTrustIdRecord(): Promise<TrustIDRecord> {
    try {
      return await this.getLastRecordByIndex<TrustIDRecord>(lastUsedAtIndex);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        "Failed to get latest used trust ID.",
        "ERROR_STORAGE_FAILED",
      );
    }
  }

  /**
   * Retrieves and signs the latest used Trust ID.
   *
   * @returns {Promise<string>} A promise that resolves to the signed trust ID.
   * @throws {StorageError} If no record is found or access fails.
   */
  public async getLatestUsedTrustId(): Promise<string> {
    const record = await this.getLatestUsedTrustIdRecord();

    record.lastUsedAt = new Date();
    await this.putRecord(record);

    const publicKey = await exportPublicKeyJwk(record.keyPair);
    const token = toTrustIDPayload(record.id);
    const trustId = await signJwtWithJwk(
      token,
      publicKey,
      record.keyPair.privateKey,
    );
    return trustId;
  }

  /**
   * Generates a Trust ID for a user and stores it.
   * @param {string} [username] - The username associated with the trust ID.
   * @returns {Promise<string>} The signed trust ID.
   */
  public async setTrustId(username: string): Promise<string> {
    const keyPair = await generateES256KeyPair();
    const publicKey = await exportPublicKeyJwk(keyPair);
    const token = toTrustIDPayload();
    const trustId = await signJwtWithJwk(token, publicKey, keyPair.privateKey);

    await this.putRecord({
      id: token.id,
      appId: this.appId,
      username,
      keyPair,
      lastUsedAt: new Date(),
      valid: false,
    });

    return trustId;
  }

  /**
   * Creates a JWS using the stored Trust ID.
   * @param {string} username - The username to retrieve the Trust ID for.
   * @returns {Promise<string>} The signed trust ID.
   */
  public async signWithTrustId(username: string): Promise<string> {
    const record = await this.getByIndex<TrustIDRecord>(
      appIdUsernameCompositeIndex,
      [this.appId, username],
    );

    record.lastUsedAt = new Date();
    await this.putRecord(record);

    const publicKey = await exportPublicKeyJwk(record.keyPair);
    const token = toTrustIDPayload(record.id);
    const trustId = await signJwtWithJwk(
      token,
      publicKey,
      record.keyPair.privateKey,
    );
    return trustId;
  }

  /**
   * Tries to get the latest used trust ID, if not found, it creates a new one without a username.
   * @returns {Promise<string>} The signed trust ID.
   */
  public async getLatestOrCreateTrustId(): Promise<string> {
    try {
      return await this.getLatestUsedTrustId();
    } catch (error) {
      if (
        error instanceof StorageError &&
        error.code === "ERROR_STORAGE_NOT_FOUND"
      ) {
        return await this.setTrustId("");
      }
      throw error;
    }
  }

  /**
   * Checks if a Trust ID exists for the user. If it does, signs with it; otherwise, generates and stores a new Trust ID.
   * @param {string} username - The username associated with the trust ID.
   * @returns {Promise<string>} The signed trust ID.
   */
  public async setOrSignWithTrustId(username: string): Promise<string> {
    try {
      if (!username) {
        return "";
      }
      return await this.signWithTrustId(username);
    } catch (error) {
      if (
        error instanceof StorageError &&
        error.code === "ERROR_STORAGE_NOT_FOUND"
      ) {
        return await this.setTrustId(username);
      }
      console.log("IndexDB error: " + error);
      return "";
    }
  }

  /**
   * Retrieves all Trust ID records associated with the given appId.
   * @returns {Promise<TrustIDRecord[]>} A promise that resolves to an array of trust IDs.
   */
  public async getAllTrustIds(): Promise<TrustIDRecord[]> {
    try {
      const records = await this.getAllByIndex<TrustIDRecord>(appIdIndex, [
        this.appId,
      ]);
      return records;
    } catch (error) {
      console.error("Error retrieving Trust IDs:", error);
      return [];
    }
  }

  /**
   * Retrieves a Trust ID record by username.
   * @param {string} username - The username to search for.
   * @returns {Promise<TrustIDRecord | null>} A promise that resolves to the TrustIDRecord or null if not found.
   */
  public async findByUsername(username: string): Promise<TrustIDRecord | null> {
    try {
      return await this.getByIndex<TrustIDRecord>(appIdUsernameCompositeIndex, [
        this.appId,
        username,
      ]);
    } catch (error) {
      console.error("Error retrieving Trust ID Record:", error);
      return null;
    }
  }

  /**
   * Deletes all Trust ID records except the one specified.
   * @param {string} username - The username whose Trust IDs should be deleted, except for the specified one.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  public async deleteAllExcept(username: string): Promise<void> {
    try {
      const records = await this.getAllTrustIds();
      const deletePromises = records
        .filter((record) => record.username !== username)
        .map((record) => this.deleteRecord(record.id));

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting Trust IDs:", error);
    }
  }
}
