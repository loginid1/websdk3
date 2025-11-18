// Copyright (C) LoginID

import { DiscoverResult, DiscoverStrategy } from "@loginid/checkout-commons";
import { WalletTrustIdStore } from "@loginid/core/store";
import { LoginIDBase } from "@loginid/core/controllers";
import { ApiError } from "@loginid/core/api";

/**
 * Class responsible for discovering user and authentication contexts.
 * Implements the DiscoverStrategy to implement the discover method.
 */
export class CheckoutDiscovery extends LoginIDBase implements DiscoverStrategy {
  /**
   * Determines the appropriate authentication flow based on available user information.
   *
   * It attempts to retrieve the only available wallet checkout ID from the checkout ID store.
   * If found and is valid, the method returns `EMBED`.
   * If not found or is invalid, it defaults to `REDIRECT`.
   *
   * @returns {Promise<DiscoverResult>} A promise resolving to the discovery result,
   * indicating the appropriate flow (`EMBED` or `REDIRECT`).
   */
  async discover(): Promise<DiscoverResult> {
    // Attempt to find the first one trust ID
    const store = new WalletTrustIdStore();
    const walletTrustId = await store.setOrSignWithCheckoutId();

    let isValid: boolean | null = null;

    try {
      await this.service.mfa.mfaMfaDiscover({
        requestBody: { trustItems: { wallet: walletTrustId } },
      });
      isValid = true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        isValid = false;
      }
    }

    // Fallback to client-side validation only when the result is inconclusive
    if (isValid === null) {
      isValid = await store.isCheckoutIdValid();
    }

    if (isValid) {
      return { flow: "EMBED" };
    } else {
      return { flow: "REDIRECT" };
    }
  }
}
