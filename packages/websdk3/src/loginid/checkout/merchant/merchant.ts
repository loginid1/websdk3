// Copyright (C) LoginID

import {
  EmbeddedContextData,
  EmbeddedContextResult,
  StartCheckoutParams,
} from "./types";
import CheckoutIdStore from "../../lib/store/checkout-id";
import { CheckoutDiscoveryMerchant } from "../discovery";
import { createMerchantCommunicator } from "../creators";

class LoginIDMerchantCheckout {
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

      if (result.checkoutId) {
        CheckoutIdStore.setCheckoutId(result.checkoutId);
      }

      await params.successCallback?.(result.checkoutId || "");
      return;
    }

    await params.fallbackCallback();
  }
}

export default LoginIDMerchantCheckout;
