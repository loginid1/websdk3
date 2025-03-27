// Copyright (C) LoginID

import {
  ApiError,
  AuthCode,
  CreationResult,
  DeviceInfo,
  Mfa,
  MfaAction,
  User,
} from "../api";

export type Complete<T> = {
  [P in keyof T]-?: T[P];
};

export type UsernameType = User["usernameType"];
export type DeviceInfoRequestBody = DeviceInfo;
export type Transports = CreationResult["transports"];
export type MfaFlow = Mfa["flow"];
export type MfaFactor = MfaAction;
export type MfaFactorName = MfaAction["action"]["name"];

export type Message = "email" | "sms";

export type FallbackOptions = string[];
export type FallbackCallback = (
  username: string,
  options: FallbackOptions,
) => Promise<void>;
export type SuccessCallback = (result: AuthResult) => Promise<void>;

export interface Callbacks {
  onFallback?: FallbackCallback;
  onSuccess?: SuccessCallback;
}

export interface AllOptions {
  authzToken?: string;
  usernameType?: UsernameType;
  displayName?: string;
  callbacks?: Callbacks;
}

export interface MfaInfo {
  username?: string;
  flow?: MfaFlow;
  next?: MfaAction[];
  session?: string;
}

/**
 * Represents an individual MFA factor that the user must complete.
 */
export interface RemainingFactor {
  /**
   * The type of the MFA factor, such as passkey or OTP via email or SMS.
   * Use this value in performAction to initiate the factor.
   */
  type: MfaFactorName;

  /**
   * A user-friendly label for the factor, providing context on how it should be used.
   */
  label: string;

  /**
   * A description of the MFA factor, explaining its purpose or instructions for completion.
   */
  description?: string;

  /**
   * A unique token for authentication, useful for advanced MFA flows across multiple devices.
   *
   * This is available for the following MFA factor:
   * - passkey
   *
   * Example: To authenticate or add a passkey on another device, pass this value
   * along with the session token to continue the MFA process.
   */
  value?: string;

  /**
   * A list of available options for the MFA factor, if applicable.
   *
   * Supported for the following MFA factors:
   * - otp:email
   * - otp:sms
   *
   * Typically includes valid email addresses or phone numbers for OTP delivery.
   */
  options?: string[];
}

/**
 * Represents the result of a Multi-Factor Authentication (MFA) session.
 * This interface is used to track the status of an ongoing MFA process, including
 * remaining factors, user details, and issued authentication tokens.
 */
export interface MfaSessionResult {
  /**
   * The MFA flow type indicating whether the session is part of sign-in or sign-up.
   * This helps differentiate between authentication scenarios.
   */
  flow?: MfaFlow;

  /**
   * List of MFA factors that still need to be completed for authentication.
   * If this list is empty, the authentication process is complete.
   */
  remainingFactors: RemainingFactor[];

  /**
   * The username associated with the authentication session.
   * This may be undefined if not provided or applicable.
   */
  username?: string;

  /**
   * Indicates whether the MFA session is complete.
   * If `true`, all required factors have been successfully validated.
   */
  isComplete: boolean;

  /**
   * The MFA state session.
   * This should be obtained from a previous MFA request or initiation step.
   */
  session?: string;

  /**
   * A JSON Web Token (JWT) issued upon successful authentication.
   * Used to verify user identity and grant access to protected resources.
   */
  idToken?: string;

  /**
   * A JSON Web Token (JWT) used for authorizing API requests.
   * This token grants access to user-specific resources and actions.
   */
  accessToken?: string;

  /**
   * A token used to obtain new access and ID tokens after expiration.
   * This helps maintain user sessions without requiring re-authentication.
   */
  refreshToken?: string;

  /**
   * A JSON Web Signature (JWS) that provides cryptographic proof of the payload's integrity.
   * Ensures that the authentication data has not been tampered with.
   */
  payloadSignature?: string;
}

/**
 * A set of tokens obtained upon login.
 */
export interface LoginIDTokenSet {
  /**
   * The ID token representing the authenticated session.
   */
  idToken: string;

  /**
   * The access token used for authorization.
   */
  accessToken: string;

  /**
   * The refresh token used to obtain new access tokens.
   */
  refreshToken: string;

  /**
   * A JSON Web Signature (JWS) that provides cryptographic proof of the payload's integrity.
   * Ensures that the authentication data has not been tampered with.
   */
  payloadSignature?: string;
}

/**
 * Configuration for LoginID FIDO service.
 */
export interface LoginIDConfig {
  /**
   * The base URL for LoginID FIDO service which can be obtained on the [dashboard](https://dashboard.loginid.io).
   */
  baseUrl: string;

  /**
   * The optional app ID for specific application.
   */
  appId?: string;
}

/**
 * The base interface for passkey options.
 */
export interface PasskeyOptions {
  /**
   * Authorization token used for accessing protected resources typically used for adding multiple passkeys to a user.
   */
  authzToken?: string;

  /**
   * Callback functions that can be triggered on various events during the authentication process.
   */
  callbacks?: Callbacks;

  /**
   * The type of username validation to be used. Defaults to **`other`**.
   */
  usernameType?: UsernameType;
  // disable hints for now
  //hints?: string[]
}

/**
 * The base interface for passkey management options.
 */
export interface PasskeyManagementOptions {
  /**
   * Authorization token used for authorizing passkey management actions.
   */
  authzToken?: string;
}

/**
 * List passkeys options.
 */
export interface ListPasskeysOptions extends PasskeyManagementOptions {}

/**
 * Rename passkeys options.
 */
export interface RenamePasskeyOptions extends PasskeyManagementOptions {}

/**
 * Delete passkeys options.
 */
export interface DeletePasskeyOptions extends PasskeyManagementOptions {}

/**
 * Authenticate with passkeys options.
 */
export interface AuthenticateWithPasskeysOptions extends PasskeyOptions {
  /**
   * When true it will enable passkeys on the browser autofill suggestions if supported (conditional UI). Username does not need to be set.
   */
  autoFill?: boolean;

  /**
   * This should be used with the **`options.autoFill`** option to trigger the cancellation of the passkey conditional UI.
   * Pass this if additional passkeys API calls may be anticipated on the current context page.
   */
  abortController?: AbortController;
}

/**
 * Authenticate with passkey autofill options.
 */
export interface AuthenticateWithPasskeyAutofillOptions
  extends AuthenticateWithPasskeysOptions {}

/**
 * Create passkeys options interface.
 */
export interface CreatePasskeyOptions extends PasskeyOptions {
  /**
   * A human-palatable name for the user account, intended only for display on your passkeys and modals.
   */
  displayName?: string;
}

/**
 * Confirm transaction options.
 */
export interface ConfirmTransactionOptions extends PasskeyOptions {
  /**
   * Specify the type of transaction being confirmed for additional validation.
   */
  txType?: string;

  /**
   * A unique nonce to ensure the transaction's integrity and prevent replay attacks
   */
  nonce?: string;
}

/**
 * Request and send OTP options.
 */
export interface RequestAndSendOtpOptions {
  /**
   * The type of username validation to be used. Defaults to **`other`**.
   */
  usernameType?: UsernameType;
}

/**
 * Request OTP options.
 */
export interface RequestOtpOptions
  extends AuthenticateWithPasskeyAutofillOptions {}

/**
 * Validate OTP options.
 */
export interface ValidateOtpOptions extends RequestAndSendOtpOptions {}

/**
 * The result after requesting an OTP with **`requestOtp`**.
 */
export interface Otp extends AuthCode {}

/**
 * The result after a successful authentication process either with passkeys or OTP.
 */
export interface AuthResult {
  /**
   * Indicates whether the user is authenticated. If **`false`**, a fallback options can be taken place if available on **`fallbackOptions`**.
   */
  isAuthenticated: boolean;

  /**
   * A short-lived authorization token is returned, allowing access to protected resources for the given user such as listing, renaming or deleting passkeys.
   */
  token: string;

  /**
   * The unique identifier of the authenticated user.
   */
  userId: string;

  /**
   * The identifier for the passkey used in authentication, if applicable.
   */
  passkeyId?: string;

  /**
   * An identifier for the device used in the authentication process. This property helps determine if supported authentications can be proceeded,
   * allowing future authentications to identify the device correctly.
   */
  deviceID?: string;

  /**
   * If **`true`**, the authentication process should resort to a fallback method as specified in **`fallbackOptions`**.
   */
  isFallback: boolean;

  /**
   * This property will be returned if the LoginID indicates that the user is unlikely to proceed with passkey authentication.
   * In this case, instead of prompting for passkey authentication, available cross-authentication options are listed as an alternative,
   * providing suggested authentications to use instead.
   */
  fallbackOptions?: FallbackOptions;
}

/**
 * General information about the current user session. Information is obtained from the stored authorization token.
 */
export interface SessionInfo {
  /**
   * Current authenticated user's username.
   */
  username: string;

  /**
   * Current authenticated user's ID.
   */
  id: string;
}

/**
 * The result of verifying the application's configuration settings.
 */
export interface VerifyConfigResult {
  /**
   * Indicates whether the configuration is valid.
   */
  isValid: boolean;

  /**
   * Suggested solution to fix any configuration issues.
   */
  solution?: string;

  /**
   * A message describing the issue with the configuration, if any.
   */
  message?: string;

  /**
   * A code representing the error type.
   */
  code?: string;
}

/**
 * Options for beginning Multi-Factor Authentication (MFA).
 */
export interface MfaBeginOptions {
  /**
   * A human-palatable name for the user account, intended only for display on your passkeys and modals.
   */
  displayName?: string;

  /**
   * The type of username validation to be used. Defaults to **`other`**.
   */
  usernameType?: UsernameType;

  /**
   * A string representing transaction details for confirmation during MFA.
   * This can be any descriptive text, but using a JSON-formatted string is recommended
   * for structured transaction details.
   *
   * Example (plain text):
   * ```
   * Payment of $100 to John Doe
   * ```
   *
   * Example (JSON):
   * ```json
   * {
   *   "transactionId": "12345",
   *   "amount": "100.00",
   *   "currency": "USD",
   *   "recipient": "john.doe@example.com"
   * }
   * ```
   */
  txPayload?: string;

  // NOTE: This doc might need to be changed after
  /**
   * An identifier generated on the merchant side to identify the current checkout session.
   * This identifier is used as a key to retrieve associated trust information.
   *
   * It is passed to the wallet to link the session with wallet-issued identity data,
   * enabling secure transaction confirmation without revealing end-user identity to the merchant.
   */
  checkoutId?: string;
}

/**
 * Options for performing an MFA authentication factor.
 */
export interface MfaPerformActionOptions {
  /**
   * The MFA state session.
   * This should be obtained from a previous MFA request or initiation step.
   */
  session?: string;

  /**
   * The payload required for completing the authentication factor.
   * This typically contains user input or challenge-response data.
   */
  payload?: string;
}

/**
 * Represents the claims included in a TrustID token.
 */
export interface TrustIDClaims {
  /**
   * Unique identifier for the Trust ID.
   */
  id: string;

  /**
   * Username associated with the token owner.
   */
  username: string;

  /**
   * Audience for which the token is intended. This is the app ID.
   */
  aud: string;
}

/**
 * Represents a stored Trust ID record in the trust store database.
 */
export interface TrustIDRecord {
  /**
   * Unique identifier for the Trust ID, derived from the TrustID token.
   */
  id: string;

  /**
   * Username associated with the Trust ID.
   */
  username: string;

  /**
   * Cryptographic key pair used for signing and verification.
   */
  keyPair: CryptoKeyPair;
}

/**
 * Represents a stored checkout ID record.
 */
export interface CheckoutIDRecord {
  /**
   * Unique identifier for the Trust ID, derived from the TrustID token.
   */
  id: string;

  /**
   * Cryptographic key pair used for signing and verification.
   */
  keyPair: CryptoKeyPair;
}

export { ApiError };
