// Copyright (C) LoginID

/**
 * Extracts the origin from a given URL string.
 *
 * @param {string} rawUrl - The full URL from which to extract the origin.
 * @returns {string} The origin part of the URL (e.g., "https://example.com").
 *
 */
export const getOriginFromUrl = (rawUrl: string): string => {
  try {
    return new URL(rawUrl).origin;
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
};
