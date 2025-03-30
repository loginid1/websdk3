// Copyright (C) LoginID

import { MerchantCommunicator } from "../communicators/types";
import { StartCheckoutParams } from "../merchant/types";
import { MerchantToWallet } from "../communicators";
import { getOriginFromUrl } from "../helpers";
import { ParentMessages } from "../messages";

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
