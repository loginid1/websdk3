// Copyright (C) LoginID

import {
  DiscoverResult,
  DiscoverStrategy,
  DiscoverOptions,
} from "@loginid/checkout-commons";
import { LoginIDBase } from "@loginid/core/controllers";
import { TrustStore } from "@loginid/core/store";
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
   * @param {DiscoverOptions} [options] - Options for discovery.
   * @returns {Promise<DiscoverResult>} A promise resolving to the discovery result,
   * indicating the appropriate flow (`EMBED` or `REDIRECT`).
   */
  async discover(options?: DiscoverOptions): Promise<DiscoverResult> {
    // Attempt to find the first one trust ID
    const store = TrustStore.forCheckout();
    const walletTrustId = await store.getLatestOrCreateTrustId();

    try {
      const discoverPromise = this.service.mfa.mfaMfaDiscover({
        requestBody: { trustItems: { wallet: walletTrustId } },
      });

      if (options?.timeout) {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("Discovery timed out")),
            options.timeout,
          ),
        );
        await Promise.race([discoverPromise, timeoutPromise]);
      } else {
        await discoverPromise;
      }

      return { flow: "EMBED", status: "SUCCESS" };
    } catch (error) {
      if (error instanceof Error && error.message === "Discovery timed out") {
        return {
          flow: "REDIRECT",
          status: "TIMEOUT",
          reason: "TIMEOUT",
        };
      }

      if (error instanceof ApiError && error.status === 404) {
        return {
          flow: "REDIRECT",
          status: "FAILED",
          reason: "NOT_FOUND",
        };
      }

      // Fallback to client-side validation only when the result is inconclusive
      const isValid = await store.isTrustIdValid();
      if (isValid) {
        return { flow: "EMBED", status: "SUCCESS" };
      }

      return {
        flow: "REDIRECT",
        status: "FAILED",
        reason: "UNKNOWN",
      };
    }
  }
}
