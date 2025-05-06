// Copyright (C) LoginID

import {
  ReceiverType,
  buildQueryParamsAndRedirect,
} from "@loginid/checkout-commons";
import { ParentMessagesAPI } from "../messages";
import { MerchantCommunicator } from "./types";

/**
 * A communicator used by the merchant to interact with the wallet.
 *
 * Depending on the receiver type, this class supports:
 * - Sending a message to an embedded wallet iframe.
 * - Redirecting the user to the wallet page for full-page authentication.
 */
export class MerchantToWallet implements MerchantCommunicator {
  private walletUrl: string;
  private parentIframeApi: ParentMessagesAPI;

  /**
   * Initializes a new instance of the merchant-to-wallet communicator.
   *
   * @param {string} walletUrl - The base URL of the wallet application.
   * @param {ParentMessagesAPI} parentIframeApi - The API used to send messages to the embedded wallet iframe.
   */
  constructor(walletUrl: string, parentIframeApi: ParentMessagesAPI) {
    this.walletUrl = walletUrl;
    this.parentIframeApi = parentIframeApi;
  }

  /**
   * Sends a request to the wallet depending on the communication method (`ReceiverType`).
   *
   * - If using `"DISCOVER"`, it sends a discovery request to the embedded wallet.
   * - If using `"EMBED"`, it sends transaction data for signing.
   * - If using `"REDIRECT"`, it builds a URL and redirects the user to the wallet page with query parameters.
   *
   * @template T - The type of the payload being sent to the wallet.
   * @template U - The expected response type from the wallet.
   *
   * @param {ReceiverType} type - The communication type to use ("DISCOVER", "EMBEDM", or "REDIRECT").
   * @param {T} [payload] - Optional data to send (e.g., transaction or user info).
   * @returns {Promise<U>} - A promise resolving with the wallet's response, or `undefined` in the case of redirect.
   *
   * @throws {Error} If an unsupported receiver type is provided.
   */
  public async receiveData<T, U>(type: ReceiverType, payload?: T): Promise<U> {
    switch (type) {
      case "DISCOVER": {
        const data = await this.parentIframeApi.sendMessage("discover", {});
        return data as U;
      }

      case "EMBED": {
        const data = await this.parentIframeApi.sendMessage(
          "sign_transaction",
          { ...payload },
        );
        return data as U;
      }

      case "REDIRECT": {
        buildQueryParamsAndRedirect(this.walletUrl, { ...payload });
        return undefined as U;
      }

      default:
        throw new Error(`Invalid receiver type: ${type}`);
    }
  }
}
