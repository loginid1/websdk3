// Copyright (C) LoginID

import { MESSAGES_CHANNEL } from "./constants";

/**
 * Builds a URL with query parameters and redirects the browser to it.
 *
 * @param {string} url - The base URL to redirect to (e.g., the wallet's entry point).
 * @param {Record<string, any>} params - An object representing query parameters to append to the URL.
 */
export const buildQueryParamsAndRedirect = (
  url: string,
  params: Record<string, any>,
) => {
  const queryParams = new URLSearchParams(params).toString();
  const urlWithParams = `${url}?${queryParams}`;
  window.location.href = urlWithParams;
};

/**
 * Verifies if a message event is from the expected origin and channel.
 *
 * @param {MessageEvent} event - The message event to verify.
 * @param {string} origin - The expected origin of the message.
 * @returns {boolean} True if the message is from the expected origin and channel, false otherwise.
 */
export const verifyMessage = (event: MessageEvent, origin: string): boolean => {
  if (origin !== "*" && event.origin !== origin) return false;

  const data = event.data;
  if (!data) return false;
  if (data.channel !== MESSAGES_CHANNEL) return false;

  return true;
};
