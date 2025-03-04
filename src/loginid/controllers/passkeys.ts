import OTP from './otp'
import { defaultDeviceInfo } from '../../browser'
import { mergeFallbackOptions } from '../lib/utils'
import { NO_LOGIN_OPTIONS_ERROR } from '../lib/errors'
import { DeviceStore } from '../lib/store/device-store'
import { bufferToBase64Url, parseJwt } from '../../utils'
import AbortControllerManager from '../../abort-controller'
import { createPasskeyCredential, getPasskeyCredential } from '../lib/webauthn'
import { confirmTransactionOptions, passkeyOptions, toAuthResult } from '../lib/defaults'
import type {
  AuthenticateWithPasskeyAutofillOptions,
  AuthenticateWithPasskeysOptions,
  AuthResult,
  ConfirmTransactionOptions,
  CreatePasskeyOptions,
  LoginIDConfig,
  Otp,
  RequestOtpOptions,
  Transports
} from '../types'
import {
  AuthCompleteRequestBody,
  AuthInit,
  AuthInitRequestBody,
  JWT,
  RegCompleteRequestBody,
  RegInit,
  RegInitRequestBody,
  TxComplete,
  TxCompleteRequestBody,
  TxInitRequestBody,
} from '../../api'
import { TrustStore } from '../lib/store/trust-store'

/**
 * Extends LoginIDBase to support creation and authentication of passkeys.
 */
class Passkeys extends OTP {
  /**
   * Initializes a new Passkeys instance with the provided configuration.
   * 
   * @param {LoginIDConfig} config Configuration object for LoginID.
   * 
   */
  constructor(config: LoginIDConfig) {
    super(config)
  }

  /**
   * A helper function that creates a public-key credential using WebAuthn API. It is designed to be used with LoginID's
   * passkey creation flow. The function takes a registration initialization response and returns a registration completion request body.
   * 
   * @param {RegInit} regInitResponseBody The response body from registration initialization.
   * @returns {Promise<RegRegCompleteRequestBody>} Completion request body for registration.
   */
  private async createNavigatorCredential(regInitResponseBody: RegInit) {
    const { registrationRequestOptions, session } = regInitResponseBody

    AbortControllerManager.renewWebAuthnAbortController()

    const credential = await createPasskeyCredential(registrationRequestOptions)
    const response = credential.response as AuthenticatorAttestationResponse

    const publicKey = response.getPublicKey && response.getPublicKey()
    const publicKeyAlg = response.getPublicKeyAlgorithm && response.getPublicKeyAlgorithm()
    const authenticatorData = response.getAuthenticatorData && response.getAuthenticatorData()
    const transports = response.getTransports && response.getTransports() as Transports

    const regCompleteRequestBody: RegCompleteRequestBody = {
      creationResult: {
        attestationObject: bufferToBase64Url(response.attestationObject),
        clientDataJSON: bufferToBase64Url(response.clientDataJSON),
        credentialId: credential.id,
        ...publicKey && { publicKey: bufferToBase64Url(publicKey) },
        ...publicKeyAlg && { publicKeyAlgorithm: publicKeyAlg },
        ...authenticatorData && { authenticatorData: bufferToBase64Url(authenticatorData) },
        ...transports && { transports: transports },
      },
      session: session,
    }

    return regCompleteRequestBody
  }

  /**
   * This method helps to create a passkey. The only required parameter is the username, but additional attributes can be provided in the options parameter.
   * Note: While the authorization token is optional, it must always be used in a production environment. You can skip it during development by adjusting 
   * the app configuration in the LoginID dashboard.
   * 
   * A short-lived authorization token is returned, allowing access to protected resources for the given user such as listing, renaming or deleting passkeys.
   * 
   * @param {string} username Username to register.
   * @param {string} authzToken Authorization token for passkey creation.
   * @param {CreatePasskeyOptions} options Additional passkey creation options.
   * @returns {Promise<AuthResult>} Result of the passkey creation operation.
   * @example
   * ```javascript
   * import { LoginIDWebSDK } from "@loginid/websdk3";
   *
   * // Obtain credentials from LoginID
   * const BASE_URL = process.env.BASE_URL;
   *
   * // Initialize the SDK with your configuration
   * const config = {
   *   baseUrl: BASE_URL,
   * };
   *
   * // Use the SDK components for signup and signin
   * const lid = new LoginIDWebSDK(config);
   *
   * // Button click handler
   * async function handleSignupButtonClick() {
   *   const username = "billy@loginid.io";
   *
   *   try {
   *     // Sign up with a passkey
   *     const signupResult = await lid.createPasskey(username);
   *     // Handle the signup result
   *     console.log("Signup Result:", signupResult);
   *   } catch (error) {
   *     // Handle errors
   *     console.error("Error during signup:", error);
   *   }
   * }
   *
   * // Attach the click handler to a button
   * const signinButton = document.getElementById("signinButton");
   * signinButton.addEventListener("click", handleSigninButtonClick);
   * ```
   */
  async createPasskey(username: string, authzToken: string = '', options: CreatePasskeyOptions = {}): Promise<AuthResult> {
    const appId = this.config.getAppId()
    const deviceId = DeviceStore.getDeviceId(appId)
    const deviceInfo = defaultDeviceInfo(deviceId)
    const trustStore = new TrustStore(appId)
    const opts = passkeyOptions(username, authzToken, options)

    opts.authzToken = this.session.getToken(opts)
    if (opts.authzToken) {
      // guard against username mismatch
      const parsedToken = parseJwt(opts.authzToken)
      if (parsedToken.username !== username) {
        opts.authzToken = ''
      }
    }

    const trustInfo = await trustStore.setOrSignWithTrustId(username)

    const regInitRequestBody: RegInitRequestBody = {
      app: {
        id: appId,
      },
      deviceInfo: deviceInfo,
      user: {
        username: username,
        usernameType: opts.usernameType,
        displayName: opts.displayName,
      },
      ...trustInfo && { trustInfo: trustInfo },
    }

    const regInitResponseBody = await this.service
      .reg
      .regRegInit({ 
        requestBody: regInitRequestBody,
        ...opts.authzToken && { authorization: opts.authzToken },
      })

    const regCompleteRequestBody = await this.createNavigatorCredential(regInitResponseBody)

    const regCompleteResponse = await this.service
      .reg
      .regRegComplete({ requestBody: regCompleteRequestBody })

    const result: AuthResult = toAuthResult(regCompleteResponse)

    this.session.setJwtCookie(regCompleteResponse.jwtAccess)
    DeviceStore.persistDeviceId(appId, deviceId || regCompleteResponse.deviceId)

    return result
  }

  /**
   * A helper function that attempts public-key credential authentication using WebAuthn API. It is designed to be used with LoginID's
   * passkey authentication flow. The function takes an authentication initialization response and returns an authentication completion request body.
   * 
   * @param {AuthInit} authInitResponseBody The response body from authentication initialization.
   * @param {AuthenticateWithPasskeysOptions} options Additional options for authentication.
   * @returns {Promise<AuthAuthCompleteRequestBody>} Completion request body for authentication.
   */
  private async getNavigatorCredential(authInitResponseBody: AuthInit, options: AuthenticateWithPasskeysOptions = {}) {
    const { assertionOptions, session } = authInitResponseBody

    if (!options.abortController) {
      AbortControllerManager.renewWebAuthnAbortController()
      options.abortController = AbortControllerManager.abortController
    } else {
      AbortControllerManager.assignWebAuthnAbortController(options.abortController)
    }

    const credential = await getPasskeyCredential(assertionOptions, options)
    const response = credential.response as AuthenticatorAssertionResponse

    const authCompleteRequestBody: AuthCompleteRequestBody = {
      assertionResult: {
        authenticatorData: bufferToBase64Url(response.authenticatorData),
        clientDataJSON: bufferToBase64Url(response.clientDataJSON),
        credentialId: credential.id,
        signature: bufferToBase64Url(response.signature),
        ...response.userHandle && { userHandle: bufferToBase64Url(response.userHandle) }
      },
      session: session,
    }

    return authCompleteRequestBody
  }

  /**
   * This method authenticates a user with a passkey and may trigger additional browser dialogs to guide the user through the process.
   * 
   * A short-lived authorization token is returned, allowing access to protected resources for the given user such as listing, renaming or deleting passkeys.
   * 
   * @param {string} username Username to authenticate. When empty, usernameless passkey authentication is performed.
   * @param {AuthenticateWithPasskeysOptions} options Additional authentication options.
   * @returns {Promise<AuthResult>} Result of the passkey authentication operation.
   * @example
   * ```javascript
   * import { LoginIDWebSDK } from "@loginid/websdk3";
   * 
   * // Obtain credentials from LoginID
   * const BASE_URL = process.env.BASE_URL;
   * 
   * // Initialize the SDK with your configuration
   * const config = {
   *   baseUrl: BASE_URL,
   * };
   * 
   * // Use the SDK components for signup and signin
   * const lid = new LoginIDWebSDK(config);
   * 
   * // Button click handler
   * async function handleSignupButtonClick() {
   *   const username = "billy@loginid.io";
   * 
   *   try {
   *     // Sign in with a passkey
   *     const signinResult = await lid.authenticateWithPasskey(username);
   *     // Handle the signin result
   *     console.log("Signin Result:", signinResult);
   *   } catch (error) {
   *     // Handle errors
   *     console.error("Error during signin:", error);
   *   }
   * }
   * 
   * // Attach the click handler to a button
   * const signinButton = document.getElementById("signinButton");
   * signinButton.addEventListener("click", handleSigninButtonClick);
   * ```
   */
  async authenticateWithPasskey(username = '', options: AuthenticateWithPasskeysOptions = {}): Promise<AuthResult> {
    const appId = this.config.getAppId()
    const deviceInfo = defaultDeviceInfo(DeviceStore.getDeviceId(appId))
    const trustStore = new TrustStore(appId)
    const opts = passkeyOptions(username, '', options)

    const trustInfo = await trustStore.setOrSignWithTrustId(
      options.autoFill ? '' : username,
    )
  
    const authInitRequestBody: AuthInitRequestBody = {
      app: {
        id: appId,
      },
      deviceInfo: deviceInfo,
      user: {
        username: username,
        usernameType: opts.usernameType,
      },
      ...trustInfo && { trustInfo: trustInfo },
    }

    const authInitResponseBody = await this.service
      .auth
      .authAuthInit({ requestBody: authInitRequestBody })

    switch (authInitResponseBody.action) {
    case 'proceed': {
      // We can send original options here because WebAuthn options currently don't need to be defaulted
      const authCompleteRequestBody = await this.getNavigatorCredential(authInitResponseBody, options)

      const authCompleteResponse = await this.service
        .auth
        .authAuthComplete({ requestBody: authCompleteRequestBody })

      const result = toAuthResult(authCompleteResponse)

      this.session.setJwtCookie(result.token)

      DeviceStore.persistDeviceId(appId, authCompleteResponse.deviceId)

      if (opts?.callbacks?.onSuccess) {
        await opts.callbacks.onSuccess(result)
      }

      return result
    }

    case 'crossAuth':
    case 'fallback': {
      if (opts?.callbacks?.onFallback) {
        const fallbackOptions = mergeFallbackOptions(authInitResponseBody)

        await opts.callbacks.onFallback(username, fallbackOptions)
      }

      const emptyResponse: JWT = { userId: '', jwtAccess: '' }
      return toAuthResult(emptyResponse, false, true)
    }

    default:
      throw NO_LOGIN_OPTIONS_ERROR
    }
  }

  /**
   * Authenticates a user by utilizing the browser's passkey autofill capabilities.
   * 
   * A short-lived authorization token is returned, allowing access to protected resources for the given user such as listing, renaming or deleting passkeys.
   * 
   * @param {AuthenticateWithPasskeyAutofillOptions} options Additional authentication options.
   * @returns {Promise<AuthResult>} Result of the passkey authentication operation.
   * @example
   * * import { isConditionalUIAvailable, LoginIDWebSDK } from "@loginid/websdk3";
   * 
   * // Obtain credentials from LoginID
   * const BASE_URL = process.env.BASE_URL;
   * 
   * // Initialize the SDK with your configuration
   * const config = {
   *   baseUrl: BASE_URL,
   * };
   * 
   * // Use the SDK components for signup and signin
   * const lid = new LoginIDWebSDK(config);
   * 
   * window.addEventListener("load", async (event) => {
   *   try {
   *     const result = await isConditionalUIAvailable();
   *     if (!result) {
   *       // If conditional UI is not supported then continue without it or handle what to do
   *       // next here.
   *       return;
   *     }
   * 
   *     const result = await lid.authenticateWithPasskeyAutofill();
   *     console.log("Authentication Result:", result);
   *   } catch (error) {
   *     // Handle errors
   *     console.error("Error during authentication:", error);
   *   }
   * });
   */
  async authenticateWithPasskeyAutofill(options: AuthenticateWithPasskeyAutofillOptions = {}): Promise<AuthResult> {
    options.autoFill = true
    return await this.authenticateWithPasskey('', options)
  }

  /**
   * This method returns a one-time OTP to be displayed on the current device. The user must be authenticated on this device. 
   * The OTP is meant for cross-authentication, where the user reads the OTP from the screen and enters it on the target device.
   * 
   * @param {string} username The username used for passkey authentication and OTP request.
   * @param {RequestOtpOptions} options Additional request OTP options.
   * @returns {Promise<Otp>} Result of the request OTP operation returning an OTP and expiry time.
   * @example
   * ```javascript
   * import { LoginIDWebSDK } from "@loginid/websdk3";
   * 
   * // Obtain credentials from LoginID
   * const BASE_URL = process.env.BASE_URL;
   * 
   * // Initialize the SDK with your configuration
   * const config = {
   *   baseUrl: BASE_URL,
   * };
   * 
   * // Use the SDK components for signup and signin
   * const lid = new LoginIDWebSDK(config);
   * 
   * // Button click handler
   * async function handleRequestOTPButtonClick() {
   *   const username = "billy@loginid.io";
   * 
   *   try {
   *     // Request OTP with passkey
   *     const result = await lid.requestOtp(username);
   *     const otp = result.code;
   *     console.log("The OTP is: ", otp);
   *   } catch (error) {
   *     // Handle errors
   *     console.error("Error during authentication:", error);
   *   }
   * }
   * 
   * // Attach the click handler to a button
   * const requestOTPButton = document.getElementById("requestOTPButton");
   * requestOTPButton.addEventListener("click", handleRequestOTPButtonClick);
   * ```
   */
  async requestOtp(username: string, options: RequestOtpOptions = {}): Promise<Otp> {
    options.authzToken = this.session.getToken(options)
    // if no token is found, perform authentication
    if (!options.authzToken) {
      const result = await this.authenticateWithPasskey(username, options)
      // get token after authentication
      options.authzToken = result.token
    }

    const result: Otp = await this.service
      .auth
      .authAuthCodeRequest({
        authorization: options.authzToken,
      })
  
    return result
  }

  /**
   * This method initiates a non-repudiation signature process by generating a transaction-specific challenge 
   * and then expects the client to provide an assertion response using a passkey. 
   * 
   * This method is useful for confirming actions such as payments 
   * or changes to sensitive account information, ensuring that the transaction is being authorized 
   * by the rightful owner of the passkey.
   * 
   * For a more detailed guide click [here](https://docs.loginid.io/scenarios/transaction-confirmation).
   * 
   * @param {string} username The username of the user confirming the transaction.
   * @param {string} txPayload The transaction-specific payload, which could include details 
   * such as the transaction amount, recipient, and other metadata necessary for the transaction.
   * @param {ConfirmTransactionOptions} options Optional parameters for transaction confirmation.
   * @returns {Promise<TxComplete>} A promise that resolves with the result of the transaction confirmation operation. 
   * The result includes details about the transaction's details and includes a new JWT access token.
   * @example
   * ```javascript
   * import { LoginIDWebSDK } from "@loginid/websdk3";
   * 
   * const config = {
   *   baseUrl: BASE_URL,
   * };
   * 
   * const lid = new LoginIDWebSDK(config);
   * 
   * const username = "jane@securelogin.com";
   * const txPayload = JSON.stringify({
   *   amount: 100,
   *   recipient: "bob@securepay.com",
   * });
   * // Unique transaction nonce
   * const nonce = "f846bb01-492e-422b-944a-44b04adc441e";
   * 
   * async function handleTransactionConfirmation() {
   *   try {
   *     // Confirm the transaction
   *     const confirmationResult = await lid.confirmTransaction(
   *       username,
   *       txPayload,
   *       nonce
   *     );
   *     // Handle the transaction confirmation result
   *     console.log("Transaction Confirmation Result:", confirmationResult);
   * 
   *     // Check nonce
   *     const { nonce: resultNonce } = confirmationResult;
   *     if (nonce !== resultNonce) {
   *       throw new Error("Nonce mismatch");
   *     }
   *   } catch (error) {
   *     // Handle errors
   *     console.error("Error during transaction confirmation:", error);
   *   }
   * }
   * 
   * // Attach the click handler to a button for transaction confirmation
   * const confirmTransactionButton = document.getElementById(
   *   "confirmTransactionButton"
   * );
   * confirmTransactionButton.addEventListener(
   *   "click",
   *   handleTransactionConfirmation
   * );
   * ```
   */
  async confirmTransaction(username: string, txPayload: string, options: ConfirmTransactionOptions = {}): Promise<TxComplete> {
    const opts = confirmTransactionOptions(username, options)
    const txInitRequestBody: TxInitRequestBody = {
      username: username,
      txPayload: txPayload,
      nonce: opts.nonce,
      txType: opts.txType,
    }

    const {assertionOptions, session} = await this.service
      .tx
      .txTxInit({ requestBody: txInitRequestBody })

    const authInitResponseBody: AuthInit = {
      action: 'proceed',
      crossAuthMethods: [],
      fallbackMethods: [],
      assertionOptions: assertionOptions,
      session: session,
    } 

    const {assertionResult} = await this.getNavigatorCredential(authInitResponseBody)

    const txCompleteRequestBody: TxCompleteRequestBody = {
      authenticatorData: assertionResult.authenticatorData,
      clientData: assertionResult.clientDataJSON,
      keyHandle: assertionResult.credentialId,
      session: session,
      signature: assertionResult.signature,
    }

    const result = await this.service
      .tx
      .txTxComplete({ requestBody: txCompleteRequestBody })

    return result
  }
}

export default Passkeys
