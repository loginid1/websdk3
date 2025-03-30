// Copyright (C) LoginID

import { EmbeddedContextResult, StartCheckoutParams } from "./types";
import { EmbeddedContextData } from "@loginid/checkout-commons";
import { CheckoutDiscoveryMerchant } from "../discovery";
import { createMerchantCommunicator } from "../creators";
import { CheckoutIdStore } from "@loginid/core/store";

class LoginIDMerchantCheckout {
  public static async getCheckoutId(): Promise<string> {
    const store = new CheckoutIdStore();
    return await store.setOrSignWithCheckoutId();
  }

  public static async startCheckout(
    params: StartCheckoutParams,
  ): Promise<void> {
    const store = new CheckoutIdStore();
    const discovery = new CheckoutDiscoveryMerchant(params.iframe.src);

    const checkoutId = await store.setOrSignWithCheckoutId();
    const discoveryResult = await discovery.discover();

    if (discoveryResult.flow === "EMBEDDED_CONTEXT") {
      const communicator = createMerchantCommunicator(params);
      const data = {
        txPayload: params.txPayload,
        checkoutId: checkoutId,
      };
      const result = await communicator.receiveData<
        EmbeddedContextData,
        EmbeddedContextResult
      >("EMBEDDED_CONTEXT", data);

      if (result.error) {
        await params.errorCallback?.(result.error);
        return;
      }

      // NOTE: set checkout cookie here after

      await params.successCallback?.(result.checkoutCookie || "");
      return;
    }

    await params.fallbackCallback();
  }
}

export default LoginIDMerchantCheckout;
