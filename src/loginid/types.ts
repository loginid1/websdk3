import {
  ApiError,
  AuthCode,
  CreationResult,
  DeviceInfo,
  User,
} from '../api'

export type Complete<T> = {
  [P in keyof T]-?: T[P];
}

export type UsernameType = User['usernameType']
export type DeviceInfoRequestBody = DeviceInfo
export type Transports = CreationResult['transports']

export type Message = 'email' | 'sms'

export type FallbackOptions = string[]
export type FallbackCallback = (username: string, options: FallbackOptions) => Promise<void>
export type SuccessCallback = (result: AuthResult) => Promise<void>

export interface Callbacks {
  onFallback?: FallbackCallback
  onSuccess?: SuccessCallback
}

export interface AllOptions {
  authzToken?: string
  usernameType?: UsernameType
  displayName?: string
  callbacks?: Callbacks
}

/**
 * Configuration for LoginID FIDO service.
 */
export interface LoginIDConfig {
  /**
   * The base URL for LoginID FIDO service which can be obtained on the [dashboard](https://dashboard.loginid.io).
   */
  baseUrl: string

  /**
   * The optional app ID for specific application.
   */
  appId?: string
}

/**
 * The base interface for passkey options.
 */
export interface PasskeyOptions {
  /**
   * Authorization token used for accessing protected resources typically used for adding multiple passkeys to a user.
   */
  authzToken?: string

  /**
   * Callback functions that can be triggered on various events during the authentication process.
   */
  callbacks?: Callbacks

  // Disable usernameType as we do not want to support this completely yet.
  //usernameType?: UsernameType
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
  authzToken?: string
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
  autoFill?: boolean

  /**
   * This should be used with the **`options.autoFill`** option to trigger the cancellation of the passkey conditional UI. 
   * Pass this if additional passkeys API calls may be anticipated on the current context page.
   */
  abortController?: AbortController
}

/**
 * Authenticate with passkey autofill options.
 */
export interface AuthenticateWithPasskeyAutofillOptions extends AuthenticateWithPasskeysOptions {}

/**
 * Create passkeys options interface.
 */
export interface CreatePasskeyOptions extends PasskeyOptions {
  /**
   * A human-palatable name for the user account, intended only for display on your passkeys and modals.
   */
  displayName?: string
}

/**
 * Confirm transaction options.
 */
export interface ConfirmTransactionOptions extends PasskeyOptions {
  /**
   * Specify the type of transaction being confirmed for additional validation.
   */
  txType?: string

  /**
   * A unique nonce to ensure the transaction's integrity and prevent replay attacks
   */
  nonce?: string
}

/**
 * Request and send OTP options.
 */
export interface RequestAndSendOtpOptions {
  // Disable usernameType as we do not want to support this completely yet.
  //usernameType?: UsernameType
}

/**
 * Request OTP options.
 */
export interface RequestOtpOptions extends AuthenticateWithPasskeyAutofillOptions {}

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
  isAuthenticated: boolean

  /**
   * A short-lived authorization token is returned, allowing access to protected resources for the given user such as listing, renaming or deleting passkeys.
   */
  token: string

  /**
   * An identifier for the device used in the authentication process. This property helps determine if supported authentications can be proceeded,
   * allowing future authentications to identify the device correctly.
   */
  deviceID?: string

  /**
   * If **`true`**, the authentication process should resort to a fallback method as specified in **`fallbackOptions`**.
   */
  isFallback: boolean

  /**
   * This property will be returned if the LoginID indicates that the user is unlikely to proceed with passkey authentication.
   * In this case, instead of prompting for passkey authentication, available cross-authentication options are listed as an alternative,
   * providing suggested authentications to use instead.
   */
  fallbackOptions?: FallbackOptions
}

/**
 * General information about the current user session. Information is obtained from the stored authorization token.
 */
export interface SessionInfo {

  /**
   * Current authenticated user's username.
   */
  username: string

  /**
   * Current authenticated user's ID.
   */
  id: string
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

export { ApiError }
