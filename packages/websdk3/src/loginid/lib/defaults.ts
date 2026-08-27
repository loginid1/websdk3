// Copyright (C) LoginID

import {
  AllOptions,
  AuthResult,
  Complete,
  ConfirmTransactionOptions,
} from "../types";
import { randomUUID } from "@loginid/core/utils/crypto";
import { AppStore } from "@loginid/core/store";
import { JWT } from "@loginid/core/api";

/**
 * Merges provided options with default values for passkey options.
 *
 * @param {string} username Username for which the passkey options are being created.
 * @param {string} authzToken Authorization token for the passkey options.
 * @param {PasskeyOptions} options Options to merge with default values.
 * @returns {Complete<PasskeyOptions>} The complete set of passkey options with defaults applied.
 */
export const passkeyOptions = (
  username: string,
  authzToken: string,
  options: AllOptions,
  appId?: string,
): Complete<Omit<AllOptions, "deviceId">> & { deviceId?: string } => {
  const deviceId = appId
    ? options.deviceId || AppStore.getDeviceId(appId)
    : options.deviceId;

  return {
    ...options,
    authzToken: authzToken || options.authzToken || "",
    usernameType: options.usernameType || "other",
    displayName: options.displayName || username,
    callbacks: options.callbacks || {},
    deviceId: deviceId || undefined,
    nonce: options.nonce || randomUUID(),
  };
};

/**
 * Merges provided options with default values for transaction confirmation options.
 *
 * @param {string} username Username for which the transaction confirmation options are being created.
 * @param {ConfirmTransactionOptions} options Options to merge with default values.
 * @returns {Complete<ConfirmTransactionOptions>} The complete set of transaction confirmation options with defaults applied.
 */
export const confirmTransactionOptions = (
  username: string,
  options: ConfirmTransactionOptions,
): Complete<ConfirmTransactionOptions> => {
  return {
    ...passkeyOptions(username, "", options),
    txType: options.txType || "raw",
    nonce: options.nonce || randomUUID(),
  };
};

/**
 * Constructs an `AuthResult` object using the provided JWT access token and authentication status.
 *
 * @param {JWT} authResponse - The authentication response containing user details and the JWT access token.
 * @param {boolean} [isAuthenticated=true] - Indicates whether the user is authenticated. Defaults to **`true`**.
 * @param {boolean} [isFallback=false] - Indicates whether the authentication attempt is a fallback method. Defaults to **`false`**.
 * @returns {AuthResult} - The authentication result, including the user ID, token, authentication status, and fallback indication.
 */
export const toAuthResult = (
  authResponse: JWT,
  isAuthenticated = true,
  isFallback = false,
): AuthResult => {
  return {
    userId: authResponse.userId,
    token: authResponse.jwtAccess,
    passkeyId: authResponse.passkeyId,
    deviceId: authResponse.deviceId,
    isAuthenticated: isAuthenticated,
    isFallback: isFallback,
    passkeyCredential: authResponse.authCred,
    txId: authResponse.txId,
  };
};
