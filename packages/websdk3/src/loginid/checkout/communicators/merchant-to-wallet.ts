// Copyright (C) LoginID

import { MerchantCommunicator, ReceiverType } from "./types";
import { buildQueryParamsAndRedirect } from "../helpers";
import { ParentMessagesAPI } from "../messages";

export class MerchantToWallet implements MerchantCommunicator {
  private walletUrl: string;
  private parentIframeApi: ParentMessagesAPI;

  constructor(walletUrl: string, parentIframeApi: ParentMessagesAPI) {
    this.walletUrl = walletUrl;
    this.parentIframeApi = parentIframeApi;
  }

  public async receiveData<T, U>(type: ReceiverType, payload?: T): Promise<U> {
    switch (type) {
      case "DISCOVER": {
        const data = await this.parentIframeApi.sendMessage("discover", {});
        return data as U;
      }

      case "EMBEDDED_CONTEXT": {
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
