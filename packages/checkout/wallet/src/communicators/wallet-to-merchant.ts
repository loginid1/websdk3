// Copyright (C) LoginID

import {
  ReceiverType,
  buildQueryParamsAndRedirect,
} from "@loginid/checkout-commons";
import { SendDataOptions, WalletCommunicator } from "./types";
import { ChildMessagesAPI } from "../messages";
import { ResultCallback } from "../types";
import { isInIframe } from "../helpers";

export class WalletToMerchant implements WalletCommunicator {
  /**
   * The API for child iframe message communication.
   * @private
   * @readonly
   * @type {ChildMessagesAPI}
   */
  private readonly childIframeApi: ChildMessagesAPI;

  constructor(childIframeApi: ChildMessagesAPI) {
    this.childIframeApi = childIframeApi;
  }

  public retrievePotentialData<T>(type: ReceiverType): T | void {
    if (!isInIframe()) {
      return;
    }

    switch (type) {
      case "EMBEDDED_CONTEXT": {
        const getPendingRequests = this.childIframeApi.getPendingRequests();

        // Find the first message request
        for (const request of getPendingRequests) {
          const { type } = request.data;
          if (type === "message") {
            return request.data.params as T;
          }
        }

        return;
      }

      default:
        throw new Error(`Invalid receiver type: ${type}`);
    }
  }

  public sendData<T, U>(
    type: ReceiverType,
    callback: ResultCallback<T, U>,
    options: SendDataOptions,
  ): void {
    if (!isInIframe()) {
      const redirectUrl = options.redirectUrl;
      if (redirectUrl) {
        buildQueryParamsAndRedirect(redirectUrl, {});
      }
      return;
    }

    switch (type) {
      case "DISCOVER": {
        this.childIframeApi.addMethod("discover", callback);
        break;
      }

      case "EMBEDDED_CONTEXT": {
        this.childIframeApi.addMethod("sign_transaction", callback);
        break;
      }

      default:
        throw new Error(`Invalid receiver type: ${type}`);
    }

    this.childIframeApi.processPendingRequests();
  }
}
