// Copyright (C) LoginID

import {
  exportPublicKeyJwk,
  generateES256KeyPair,
  generateRandomId,
} from "../../../utils";
import StorageError from "../../../errors/storage";
import { CheckoutIDRecord } from "../../types";
import { signJwtWithJwk } from "../tokens";
import IndexedDBWrapper from "./indexdb";

const dbVersion = 1;
const dbName = "loginid-checkout-store";
const trustStorageKey = `LoginID_checkout-id`;

/**
 * CheckoutIdStore extends IndexedDBWrapper to manage checkout ID records.
 */
export class CheckoutIdStore extends IndexedDBWrapper {
  /**
   * Creates an instance of CheckoutIdStore.
   */
  constructor() {
    super(dbName, dbVersion, trustStorageKey);
  }

  /**
   * Generates a random checkout ID and stores it.
   * @returns {Promise<string>} The signed checkout ID.
   */
  public async setCheckoutId(): Promise<string> {
    const keyPair = await generateES256KeyPair();
    const publicKey = await exportPublicKeyJwk(keyPair);
    const token = { id: generateRandomId() };
    const checkoutId = await signJwtWithJwk(
      token,
      publicKey,
      keyPair.privateKey,
    );

    await this.putRecord({
      id: token.id,
      keyPair,
    });

    return checkoutId;
  }

  /**
   * Retrieves the stored checkout ID if it exists.
   * @returns {Promise<string | null>} The checkout ID or null if not found.
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
   * Creates a JWS using the stored checkout ID.
   * @returns {Promise<string>} The signed checkout ID.
   */
  public async signWithCheckoutId(): Promise<string> {
    // Its expected that there should one be one checkout ID record
    const record = await this.getFirstRecord<CheckoutIDRecord>();
    const publicKey = await exportPublicKeyJwk(record.keyPair);
    const token = { id: record.id };
    const trustId = await signJwtWithJwk(
      token,
      publicKey,
      record.keyPair.privateKey,
    );
    return trustId;
  }

  /**
   * Checks if a checkout ID exists. If it does, signs with it; otherwise, generates and stores a new checkout ID.
   * @returns {Promise<string>} The signed checkout ID.
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
}
