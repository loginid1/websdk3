// Copyright (C) LoginID

import {
  DiscoverResult,
  EmbeddedContextData,
  LID_CHECKOUT_KEY,
} from "@loginid/checkout-commons";
import { LocalStorageFlagger, TrustStore } from "@loginid/core/store";
import { EmbeddedContextResult, StartCheckoutParams } from "./types";
import { CheckoutDiscoveryMerchant } from "../discovery";
import { createMerchantCommunicator } from "../creators";

/**
 * Facilitates the integration of LoginID's checkout authentication flow on the merchant side.
 *
 * This class provides methods to generate a unique `merchantTrustId` and to initiate
 * the checkout process by determining the appropriate authentication flow—either embedding the
 * wallet in an iframe for a seamless experience or falling back method.
 */
class LoginIDMerchantCheckout {
  /**
   * Generates or retrieves a unique `merchantTrustId`.
   *
   * See [What is Trust ID?](https://docs.loginid.io/next/user-scenario/checkout/merchant/#what-is-merchanttrustid)
   * for more information about its purpose and usage.
   *
   * @returns {Promise<string>} A promise that resolves with the `merchantTrustId`.
   */
  public static async getMerchantTrustId(): Promise<string> {
    const store = TrustStore.forCheckout();
    return await store.getLatestOrCreateTrustId();
  }

  /**
   * Alias for `getMerchantTrustId`.
   *
   * @returns {Promise<string>} A promise that resolves with the `merchantTrustId`.
   */
  public static async getCheckoutId(): Promise<string> {
    return LoginIDMerchantCheckout.getMerchantTrustId();
  }

  /**
   * Marks the latest merchant trust ID in storage as valid.
   *
   * See [What is Trust ID?](https://docs.loginid.io/next/user-scenario/checkout/merchant/#what-is-merchanttrustid)
   * for more information about its purpose and usage.
   *
   * @returns {Promise<void>} A promise that resolves when the record is updated.
   */
  public static async markMerchantTrustId(): Promise<void> {
    const store = TrustStore.forCheckout();
    await store.markTrustIdAsValid();
  }

  /**
   * Checks whether the stored merchant trust ID is marked as valid.
   *
   * See [What is Trust ID?](https://docs.loginid.io/next/user-scenario/checkout/merchant/#what-is-merchanttrustid)
   * for more information about its purpose and usage.
   *
   * @returns {Promise<boolean>} True if the trust ID is valid, false otherwise.
   */
  public static async isMerchantTrustIdValid(): Promise<boolean> {
    const store = TrustStore.forCheckout();
    return await store.isTrustIdValid();
  }

  /**
   * Performs wallet discovery using a hidden iframe.
   *
   * Returns a `DiscoverResult` indicating whether checkout should continue
   * using the embedded checkout flow or a redirect flow.
   *
   * See [Wallet Discovery documentation](https://docs.loginid.io/user-scenario/checkout/wallet/web/#0-discovery-page---determine-flow)
   * for details.
   *
   * @param discoverUrl - The wallet discovery page URL.
   *
   * @returns A promise resolving to the discovery result, including the
   * recommended checkout flow (`"EMBED"` or `"REDIRECT"`).
   */
  public static async discover(discoverUrl: string): Promise<DiscoverResult> {
    const discovery = new CheckoutDiscoveryMerchant(discoverUrl);
    return await discovery.discover();
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
    const store = TrustStore.forCheckout();
    const discovery = new CheckoutDiscoveryMerchant(
      params.discoverUrl || params.iframe.src,
    );

    const merchantTrustId = await store.getLatestOrCreateTrustId();
    const discoveryResult = await discovery.discover();

    if (discoveryResult.flow === "EMBED") {
      const communicator = createMerchantCommunicator(params);
      const data = {
        merchantTrustId: merchantTrustId,
      };
      const result = await communicator.receiveData<
        EmbeddedContextData,
        EmbeddedContextResult
      >("EMBED", data);

      if (result.error) {
        await params.errorCallback?.(result.error);
        return;
      }

      LocalStorageFlagger.stampWithRandomUUID(LID_CHECKOUT_KEY);

      await params.successCallback?.();
      return;
    }

    await params.fallbackCallback();
  }
}

export default LoginIDMerchantCheckout;
