// Copyright (C) LoginID

import {
  buildQueryParamsAndRedirect,
  getQueryParams,
  isInIframe,
} from "../helpers";
import { ReceiverType, SendDataOptions, WalletCommunicator } from "./types";
import { ChildMessagesAPI } from "../messages";
import { ResultCallback } from "../types";

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

  public sendData<T, U>(
    type: ReceiverType,
    callback: ResultCallback<T, U>,
    options: SendDataOptions,
  ): void {
    if (!isInIframe()) {
      const params = getQueryParams();
      const result = callback(params as T);

      const redirectUrl = options.redirectUrl;
      if (redirectUrl) {
        buildQueryParamsAndRedirect(redirectUrl, result);
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
