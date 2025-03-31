// Copyright (C) LoginID

import { MerchantCommunicator } from "../communicators/types";
import { StartCheckoutParams } from "../merchant/types";
import { MerchantToWallet } from "../communicators";
import { getOriginFromUrl } from "../helpers";
import { ParentMessages } from "../messages";

/**
 * Creates a `MerchantCommunicator` instance that communicates with an embedded wallet iframe.
 *
 * This function mounts the provided iframe into the merchant's DOM and sets up
 * message passing via the `ParentMessages` API.
 *
 * @param {StartCheckoutParams} params - Configuration for the checkout, including iframe and mount target.
 * @returns {MerchantCommunicator} A communicator instance for sending data to the wallet iframe.
 */
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

/**
 * Creates a hidden iframe and initializes a `MerchantCommunicator` for use cases where
 * communication with the wallet is required without UI interaction (e.g., background trust setup).
 *
 * The hidden iframe is appended to the document body and not visible to the user.
 *
 * @param {string} iframeUrl - The URL to load inside the hidden iframe (usually the wallet URL).
 */
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
