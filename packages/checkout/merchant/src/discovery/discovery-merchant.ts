// Copyright (C) LoginID

import { DiscoverResult, DiscoverStrategy } from "@loginid/checkout-commons";
import { createMerchantCommunicatorHidden } from "../creators";

/**
 * Class responsible for inituating discovering user and authentication contexts on merchant side.
 * Implements the DiscoverStrategy to implement the discover method.
 */
export class CheckoutDiscoveryMerchant implements DiscoverStrategy {
  private readonly iframeUrl: string;

  constructor(iframeUrl: string) {
    this.iframeUrl = iframeUrl;
  }

  async discover(): Promise<DiscoverResult> {
    // NOTE: check for checkout cookie here after
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
