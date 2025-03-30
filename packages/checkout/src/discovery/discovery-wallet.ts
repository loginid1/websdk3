// Copyright (C) LoginID

import { CheckoutIdStore } from "@loginid/core/store";
import { DiscoverStrategy } from "./types";
import { DiscoverResult } from "../types";

/**
 * Class responsible for discovering user and authentication contexts.
 * Implements the DiscoverStrategy to implement the discover method.
 */
export class CheckoutDiscovery implements DiscoverStrategy {
  /**
   * Determines the appropriate authentication flow based on available user information.
   *
   * It attempts to retrieve the only available checkout ID from the checkout ID store.
   * If found, the method returns `EMBEDDED_CONTEXT`.
   * If not found, it defaults to `REDIRECT`.
   *
   * @returns {Promise<DiscoverResult>} A promise resolving to the discovery result,
   * indicating the appropriate flow (`EMBEDDED_CONTEXT` or `REDIRECT`).
   */
  async discover(): Promise<DiscoverResult> {
    // Attempt to find the first one trust ID
    // NOTE: For now we only allow one trust ID for checkout
    const store = new CheckoutIdStore();
    const hasCheckoutId = await store.getCheckoutId();
    if (hasCheckoutId) {
      return { flow: "EMBEDDED_CONTEXT" };
    } else {
      return { flow: "REDIRECT" };
    }
  }
}
