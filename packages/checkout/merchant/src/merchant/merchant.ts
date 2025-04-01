// Copyright (C) LoginID

import {
  EmbeddedContextData,
  LID_CHECKOUT_KEY,
} from "@loginid/checkout-commons";
import { CheckoutIdStore, LocalStorageFlagger } from "@loginid/core/store";
import { EmbeddedContextResult, StartCheckoutParams } from "./types";
import { CheckoutDiscoveryMerchant } from "../discovery";
import { createMerchantCommunicator } from "../creators";

/**
 * Facilitates the integration of LoginID's checkout authentication flow on the merchant side.
 *
 * This class provides methods to generate a unique `checkoutId` and to initiate
 * the checkout process by determining the appropriate authentication flow—either embedding the
 * wallet in an iframe for a seamless experience or falling back method.
 */
class LoginIDMerchantCheckout {
  /**
   * Generates or retrieves a unique `checkoutId` for the current session.
   *
   * @returns {Promise<string>} A promise that resolves with the `checkoutId`.
   */
  public static async getCheckoutId(): Promise<string> {
    const store = new CheckoutIdStore();
    return await store.setOrSignWithCheckoutId();
  }

  /**
   * Initiates the checkout process by determining the appropriate authentication flow.
   *
   * This method first performs a discovery to decide whether to proceed with an embedded iframe
   * for an embedded on-site experience or to fall back to a full-page redirect or fallback method. It then handles
   * the communication with the wallet and manages the checkout session accordingly.
   *
   * @param {StartCheckoutParams} params - The parameters required to start the checkout process.
   * @param {HTMLIFrameElement} params.iframe - The iframe element to embed the wallet.
   * @param {HTMLElement} params.mountTarget - The DOM element where the iframe will be mounted.
   * @param {string} params.txPayload - The transaction payload representing the purchase or operation.
   * @param {string} [params.redirectUrl] - The URL to redirect to if the embedded flow is not possible.
   * @param {Function} [params.successCallback] - Callback function invoked upon successful checkout.
   * @param {Function} [params.errorCallback] - Callback function invoked if an error occurs during checkout.
   * @param {Function} [params.fallbackCallback] - Callback function invoked if the embedded flow is not possible.
   *
   * @returns {Promise<void>} A promise that resolves when the checkout process is initiated.
   */
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

      LocalStorageFlagger.stampWithRandomUUID(LID_CHECKOUT_KEY);

      await params.successCallback?.(result.checkoutCookie || "");
      return;
    }

    await params.fallbackCallback();
  }
}

export default LoginIDMerchantCheckout;
