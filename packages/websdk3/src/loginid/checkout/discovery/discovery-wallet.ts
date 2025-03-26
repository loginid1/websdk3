// Copyright (C) LoginID

import { TrustStore } from "../../lib/store/trust-store";
import { DiscoverStrategy } from "./types";
import { DiscoverResult } from "../types";

/**
 * Class responsible for discovering user and authentication contexts.
 * Implements the DiscoverStrategy to implement the discover method.
 */
export class CheckoutDiscovery implements DiscoverStrategy {
  /**
   * The application ID used for identifying the trust store.
   * @private
   * @type {string}
   */
  private appId: string;

  /**
   * Creates an instance of CheckoutDiscovery.
   * @param {string} appId - The application ID for the trust store.
   */
  constructor(appId: string) {
    this.appId = appId;
  }

  /**
   * Determines the appropriate authentication flow based on available user information.
   *
   * If a `username` is provided, it is assumed to be found locally on the merchant side,
   * and the method returns an `EMBEDDED_CONTEXT` flow with the username.
   * Otherwise, it attempts to retrieve the first available trust ID from the trust store.
   * If a trust ID is found, the method returns `EMBEDDED_CONTEXT` with the associated username.
   * If no trust ID is found, it defaults to `REDIRECT`.
   *
   * @param {string} [username] - An optional username, assumed to be found locally.
   * @returns {Promise<DiscoverResult>} A promise resolving to the discovery result,
   * indicating the appropriate flow (`EMBEDDED_CONTEXT` or `REDIRECT`).
   */
  async discover(username?: string): Promise<DiscoverResult> {
    // If username is received it hopefully means that it was found locally on merchant side
    if (username) {
      return { username: username, flow: "EMBEDDED_CONTEXT" };
    } else {
      // Attempt to find the first one trust ID
      // NOTE: For now we only allow one trust ID for checkout
      const store = new TrustStore(this.appId);
      const records = await store.getAllTrustIds();
      if (records.length > 0) {
        const { username } = records[0];
        return { username: username, flow: "EMBEDDED_CONTEXT" };
      }
    }

    return { flow: "REDIRECT" };
  }
}
