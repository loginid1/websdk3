// Copyright (C) LoginID

import {
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
   * - `flow`: Whether to continue with an `"EMBEDDED_CONTEXT"` or switch to `"REDIRECT"`.
   *
   * After the discovery request completes, the hidden iframe is removed from the DOM.
   *
   * @returns {Promise<DiscoverResult>} A promise resolving to wallet-side discovery info,
   * used to determine how to proceed with the authentication flow.
   */
  async discover(): Promise<DiscoverResult> {
    const hasHadEmbedded = LocalStorageFlagger.isStamped(LID_CHECKOUT_KEY);
    if (hasHadEmbedded) {
      return { flow: "EMBEDDED_CONTEXT" };
    }

    const { communicator, iframe } = createMerchantCommunicatorHidden(
      this.iframeUrl,
    );
    const result = await communicator.receiveData<void, DiscoverResult>(
      "DISCOVER",
    );

    iframe.remove();

    return result;
  }
}
