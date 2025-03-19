// Copyright (C) LoginID

import {
  AllOptions,
  AuthResult,
  Complete,
  ConfirmTransactionOptions,
  LoginIDTokenSet,
  MfaInfo,
  MfaSessionResult,
  RemainingFactor,
} from "../types";
import { createUUID } from "../../utils";
import { JWT, MfaNext } from "../../api";

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
): Complete<AllOptions> => {
  return {
    ...options,
    authzToken: authzToken || options.authzToken || "",
    usernameType: options.usernameType || "other",
    displayName: options.displayName || username,
    callbacks: options.callbacks || {},
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
    nonce: options.nonce || createUUID(),
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
    isAuthenticated: isAuthenticated,
    isFallback: isFallback,
  };
};

/**
 * Converts an `MfaNext` result into an `MfaInfo` object.
 *
 * @param {MfaNext} mfaNextResult - The result from an MFA authentication step.
 * @param {string} [username] - The username associated with the MFA session (optional).
 * @returns {MfaInfo} - The structured MFA information.
 */
export const toMfaInfo = (
  mfaNextResult: MfaNext,
  username?: string,
): MfaInfo => {
  return {
    username: username,
    flow: mfaNextResult.flow,
    session: mfaNextResult.session,
    next: mfaNextResult.next,
  };
};

/**
 * Converts MFA information and token set into an `MfaSessionResult` object.
 *
 * @param {MfaInfo | null} [info] - The MFA session information, if available.
 * @param {LoginIDTokenSet} [tokenSet] - The token set containing authentication tokens.
 * @returns {MfaSessionResult} - The structured MFA session result.
 */
export const toMfaSessionDetails = (
  info?: MfaInfo | null,
  tokenSet?: LoginIDTokenSet,
): MfaSessionResult => {
  const remainingFactors: RemainingFactor[] =
    info?.next?.map((factor) => {
      const { name, label, desc } = factor.action;
      const result: RemainingFactor = {
        type: name,
        label,
        ...(desc && { description: desc }),
      };

      if (factor.options) {
        const options = factor.options
          .filter(
            (option) =>
              (name === "otp:sms" || name === "otp:email") && option.label,
          )
          .map((option) => option.label!)
          .filter(Boolean);

        if (options.length) {
          result.options = options;
        }

        if (name === "passkey") {
          const passkeyOption = factor.options.find((option) => option.value);
          if (passkeyOption) result.value = passkeyOption.value;
        }
      }

      return result;
    }) || [];

  return {
    username: info?.username,
    ...(info?.username && { username: info.username }),
    flow: info?.flow,
    ...(info?.flow && { flow: info.flow }),
    remainingFactors: remainingFactors,
    isComplete: !!tokenSet?.accessToken,
    ...(info?.session && { session: info.session }),
    ...(tokenSet?.idToken && { idToken: tokenSet?.idToken }),
    ...(tokenSet?.accessToken && { accessToken: tokenSet?.accessToken }),
    ...(tokenSet?.refreshToken && { refreshToken: tokenSet?.refreshToken }),
    ...(tokenSet?.payloadSignature && {
      payloadSignature: tokenSet?.payloadSignature,
    }),
  };
};
