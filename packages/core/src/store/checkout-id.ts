// Copyright (C) LoginID

import { exportPublicKeyJwk, generateES256KeyPair } from "../utils/crypto";
import { signJwtWithJwk, toTrustIDPayload } from "../helpers";
import { IndexedDBWrapper } from "./indexdb";
import { CheckoutIDRecord } from "../types";
import { StorageError } from "../errors";

const dbVersion = 1;
const checkoutIdDbName = "lid_c_cid";
const checkoutIdStorageKey = "lid-cid-k";
const walletTrustIdDbName = "lid_c_wtid";
const walletTrustIdStorageKey = "lid-wtid-k";

/**
 * BaseCheckoutStore provides a common implementation for managing checkout ID records
 * using IndexedDB. It handles generation, storage, retrieval, and signing of unique IDs.
 */
export class BaseCheckoutStore extends IndexedDBWrapper {
  /**
   * Constructs a new BaseCheckoutStore instance.
   *
   * @param {string} dbName - The name of the IndexedDB database.
   * @param {string} trustStorageKey - The key used for namespacing storage.
   */
  constructor(dbName: string, trustStorageKey: string) {
    super(dbName, dbVersion, trustStorageKey);
  }

  /**
   * Generates a new random checkout ID, signs it using a newly created key pair,
   * and stores the key pair in IndexedDB.
   *
   * @returns {Promise<string>} A signed checkout ID (JWS).
   */
  public async setCheckoutId(): Promise<string> {
    const keyPair = await generateES256KeyPair();
    const publicKey = await exportPublicKeyJwk(keyPair);
    const token = toTrustIDPayload();
    const checkoutId = await signJwtWithJwk(
      token,
      publicKey,
      keyPair.privateKey,
    );

    await this.putRecord({
      id: token.id,
      valid: false,
      keyPair,
    });

    return checkoutId;
  }

  /**
   * Retrieves the first checkout ID from storage, if available, and returns a signed version of it.
   *
   * @returns {Promise<string | null>} The signed checkout ID or null if no ID is found.
   */
  public async getCheckoutId(): Promise<string | null> {
    try {
      const record = await this.getFirstRecord<CheckoutIDRecord>();
      const publicKey = await exportPublicKeyJwk(record.keyPair);
      const token = { id: record.id };
      const checkoutId = await signJwtWithJwk(
        token,
        publicKey,
        record.keyPair.privateKey,
      );
      return checkoutId;
    } catch (error) {
      if (
        error instanceof StorageError &&
        error.code === "ERROR_STORAGE_NOT_FOUND"
      ) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Signs a new token using the stored key pair and checkout ID.
   *
   * @returns {Promise<string>} A signed token (JWS) representing the checkout ID.
   * @throws {StorageError} If no checkout ID is found in storage.
   */
  public async signWithCheckoutId(): Promise<string> {
    const record = await this.getFirstRecord<CheckoutIDRecord>();
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
   * Checks for the existence of a checkout ID and signs with it if available;
   * otherwise, generates a new one and returns the signed value.
   *
   * @returns {Promise<string>} The signed checkout ID (JWS).
   */
  public async setOrSignWithCheckoutId(): Promise<string> {
    try {
      return await this.signWithCheckoutId();
    } catch (error) {
      if (
        error instanceof StorageError &&
        error.code === "ERROR_STORAGE_NOT_FOUND"
      ) {
        return await this.setCheckoutId();
      }
      console.log("IndexDB error: " + error);
      return "";
    }
  }

  /**
   * Marks the first checkout ID in storage as valid.
   *
   * @returns {Promise<void>} A promise that resolves when the record is updated.
   * @throws {StorageError} If no record is found or the update fails.
   */
  public async markCheckoutIdAsValid(): Promise<void> {
    try {
      const record = await this.getFirstRecord<CheckoutIDRecord>();
      record.valid = true;
      await this.putRecord(record);
    } catch {
      throw new StorageError(
        "Failed to mark checkout ID as valid.",
        "ERROR_STORAGE_UPDATE_FAILED",
      );
    }
  }

  /**
   * Checks whether the stored checkout ID is marked as valid.
   *
   * @returns {Promise<boolean>} True if the checkout ID is valid, false otherwise.
   * @throws {StorageError} If no record is found or access fails.
   */
  public async isCheckoutIdValid(): Promise<boolean> {
    try {
      const record = await this.getFirstRecord<CheckoutIDRecord>();
      return record && record.valid === true;
    } catch (error) {
      if (
        error instanceof StorageError &&
        error.code === "ERROR_STORAGE_NOT_FOUND"
      ) {
        return false;
      }
      throw new StorageError(
        "Failed to check checkout ID validity.",
        "ERROR_STORAGE_FAILED",
      );
    }
  }
}

/**
 * CheckoutIdStore is a concrete implementation of BaseCheckoutStore
 * specifically for managing checkout ID records.
 */
export class CheckoutIdStore extends BaseCheckoutStore {
  /**
   * Constructs a new CheckoutIdStore instance using predefined DB and key values.
   */
  constructor() {
    super(checkoutIdDbName, checkoutIdStorageKey);
  }
}

/**
 * WalletTrustIdStore is a concrete implementation of BaseCheckoutStore
 * specifically for managing wallet trust ID records.
 */
export class WalletTrustIdStore extends BaseCheckoutStore {
  /**
   * Constructs a new WalletTrustIdStore instance using predefined DB and key values.
   */
  constructor() {
    super(walletTrustIdDbName, walletTrustIdStorageKey);
  }
}
