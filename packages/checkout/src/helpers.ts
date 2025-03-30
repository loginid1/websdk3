// Copyright (C) LoginID

const buildQueryParamsAndRedirect = (
  url: string,
  params: Record<string, any>,
) => {
  const queryParams = new URLSearchParams(params).toString();
  const urlWithParams = `${url}?${queryParams}`;
  window.location.href = urlWithParams;
};

/**
 * Checks if the current window is inside an iframe.
 * @returns {boolean} True if in an iframe, otherwise false.
 */
const isInIframe = (): boolean => {
  return window.self !== window.top;
};

/**
 * Extracts query parameters from the URL and returns them as a Record.
 * @returns {Record<string, string>} An object representing query parameters.
 */
const getQueryParams = (): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

const getOriginFromUrl = (rawUrl: string) => {
  try {
    return new URL(rawUrl).origin;
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
};

export {
  buildQueryParamsAndRedirect,
  getOriginFromUrl,
  getQueryParams,
  isInIframe,
};
