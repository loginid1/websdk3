// Copyright (C) LoginID

import {
  EmbeddedContextData,
  EmbeddedContextResult,
  StartCheckoutParams,
} from "./types";
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
    const discovery = new CheckoutDiscoveryMerchant(params.iframe.src);
    const discoveryResult = await discovery.discover();

    if (discoveryResult.flow === "EMBEDDED_CONTEXT") {
      const communicator = createMerchantCommunicator(params);
      const data = {
        txPayload: params.txPayload,
        username: discoveryResult.username,
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
