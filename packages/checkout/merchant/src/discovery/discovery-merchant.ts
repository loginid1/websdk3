// Copyright (C) LoginID

import {
  DiscoverOptions,
  DiscoverResult,
  DiscoverStrategy,
  LID_CHECKOUT_KEY,
} from "@loginid/checkout-commons";
import { createMerchantCommunicatorHidden } from "../creators";
import { LocalStorageFlagger } from "@loginid/core/store";

/**
 * Class responsible for inituating discovering user and authentication contexts on merchant side.
 * Implements the DiscoverStrategy to implement the discover method.
 */
export class CheckoutDiscoveryMerchant implements DiscoverStrategy {
  private readonly iframeUrl: string;

  /**
   * Initializes a new instance of the discovery class for merchant-side use.
   *
   * @param {string} iframeUrl - The URL to the hosted wallet page used for hidden discovery.
   */
  constructor(iframeUrl: string) {
    this.iframeUrl = iframeUrl;
  }

  /**
   * Performs discovery by embedding a hidden iframe and requesting context from the wallet.
   *
   * The wallet responds with a `DiscoverResult`, which includes:
   * - `flow`: Whether to continue with an `"EMBED"` or switch to `"REDIRECT"`.
   *
   * After the discovery request completes, the hidden iframe is removed from the DOM.
   *
   * @param {DiscoverOptions} [options] - Options for discovery.
   * @returns {Promise<DiscoverResult>} A promise resolving to wallet-side discovery info,
   * used to determine how to proceed with the authentication flow.
   */
  async discover(options?: DiscoverOptions): Promise<DiscoverResult> {
    const hasHadEmbedded = LocalStorageFlagger.isStamped(LID_CHECKOUT_KEY);
    if (hasHadEmbedded) {
      return { flow: "EMBED", status: "SUCCESS" };
    }

    const { communicator, iframe } = createMerchantCommunicatorHidden(
      this.iframeUrl,
    );

    try {
      const discoverPromise = communicator.receiveData<void, DiscoverResult>(
        "DISCOVER",
      );

      if (options?.timeout) {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("Discovery timed out")),
            options.timeout,
          ),
        );
        return await Promise.race([discoverPromise, timeoutPromise]);
      } else {
        return await discoverPromise;
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Discovery timed out") {
        return {
          flow: "REDIRECT",
          status: "TIMEOUT",
          reason: "TIMEOUT",
        };
      }

      throw error;
    } finally {
      iframe.remove();
    }
  }
}
