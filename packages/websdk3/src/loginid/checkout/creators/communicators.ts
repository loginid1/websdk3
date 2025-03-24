// Copyright (C) LoginID

import {
  MerchantCommunicator,
  WalletCommunicator,
} from "../communicators/types";
import { MerchantToWallet, WalletToMerchant } from "../communicators";
import { ChildMessages, ParentMessages } from "../messages";
import { StartCheckoutParams } from "../merchant/types";
import { getOriginFromUrl } from "../helpers";

export const createMerchantCommunicator = (
  params: StartCheckoutParams,
): MerchantCommunicator => {
  params.mountTarget.append(params.iframe);
  const parentApi = new ParentMessages(
    params.iframe,
    getOriginFromUrl(params.iframe.src),
  );
  return new MerchantToWallet(params.iframe.src, parentApi);
};

export const createMerchantCommunicatorHidden = (iframeUrl: string) => {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.src = iframeUrl;

  const body = document.querySelector("body");
  body?.appendChild(iframe);

  const parentApi = new ParentMessages(iframe, getOriginFromUrl(iframe.src));
  const mtw = new MerchantToWallet(iframe.src, parentApi);

  return { communicator: mtw, iframe: iframe };
};

export const createWalletCommunicator = (): WalletCommunicator => {
  const childApi = new ChildMessages();
  return new WalletToMerchant(childApi);
};
