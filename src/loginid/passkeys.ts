import LoginIDBase from './base'
import { defaultDeviceInfo } from '../browser'
import { bufferToBase64Url, createUUID, parseJwt } from '../utils'
import { createPasskeyCredential, getPasskeyCredential } from '../webauthn/'
import type {
  AuthenticateWithPasskeysOptions,
  ConfirmTransactionOptions,
  LoginIDConfig,
  PasskeyOptions,
  PasskeyResult,
  RegisterWithPasskeyOptions,
  Transports
} from './types'
import {
  AuthCode,
  AuthCodeVerifyRequestBody,
  AuthCompleteRequestBody,
  AuthInit,
  AuthInitRequestBody,
  RegCompleteRequestBody,
  RegInit,
  RegInitRequestBody,
  TxCompleteRequestBody,
  TxInitRequestBody,
} from '../api'

/**
 * Extends LoginIDBase to support creation, registration, and authentication of passkeys.
 */
class Passkeys extends LoginIDBase {
  /**
   * Initializes a new Passkeys instance with the provided configuration.
   * @param {LoginIDConfig} config Configuration object for LoginID.
   */
  constructor(config: LoginIDConfig) {
    super(config)
  }

  /**
   * Aborts all ongoing operations.
   * And creates a new AbortController instance.
   */
  abortAllOperations() {
    this.abortController.abort()
    this.abortController = new AbortController()
  }

  /**
   * Creates a navigator credential using WebAuthn.
   * @param {RegInit} regInitResponseBody The response body from registration initialization.
   * @returns {Promise<RegRegCompleteRequestBody>} Completion request body for registration.
   */
  async createNavigatorCredential(regInitResponseBody: RegInit) {
    this.abortAllOperations()

    const { registrationRequestOptions, session } = regInitResponseBody

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
   * Registers a user with a passkey.
   * @param {string} username Username to register.
   * @param {RegisterWithPasskeysOptions} options Additional registration options.
   * @returns {Promise<any>} Result of the registration operation.
   */
  async registerWithPasskey(username: string, options: RegisterWithPasskeyOptions = {}): Promise<PasskeyResult> {
    this.abortAllOperations()

    const deviceInfo = defaultDeviceInfo()

    // Default to email if usernameType is not provided
    if (!options.usernameType) {
      options.usernameType = 'email'
    }

    options.token = this.getToken(options)
    if (options.token) {
      // guard against username mismatch
      const parsedToken = parseJwt(options.token)
      if (parsedToken.username !== username) {
        options.token = ''
      }
    }

    const regInitRequestBody: RegInitRequestBody = {
      app: {
        id: this.config.appId,
      },
      deviceInfo: deviceInfo,
      user: {
        username: username,
        usernameType: options.usernameType,
        ...options.displayName && { displayName: options.displayName },
      },
      ...options.session && { session: options.session },
    }

    const regInitResponseBody = await this.service
      .reg
      .regRegInit({ 
        requestBody: regInitRequestBody,
        ...options.token && { authorization: options.token },
      })

    const regCompleteRequestBody = await this.createNavigatorCredential(regInitResponseBody)

    const result = await this.service
      .reg
      .regRegComplete({ requestBody: regCompleteRequestBody })

    this.setJwtCookie(result.jwtAccess)

    return result
  }

  /**
   * Retrieves a navigator credential for authentication.
   * @param {AuthInit} authInitResponseBody The response body from authentication initialization.
   * @param {AuthenticateWithPasskeysOptions} options Additional options for authentication.
   * @returns {Promise<AuthAuthCompleteRequestBody>} Completion request body for authentication.
   */
  async getNavigatorCredential(authInitResponseBody: AuthInit, options: AuthenticateWithPasskeysOptions = {}) {
    this.abortAllOperations()

    const { assertionOptions, session } = authInitResponseBody

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
   * Authenticates a user with a passkey.
   * @param {string} username Username to authenticate.
   * @param {AuthenticateWithPasskeysOptions} options Additional authentication options.
   * @returns {Promise<any>} Result of the authentication operation.
   */
  async authenticateWithPasskey(username = '', options: AuthenticateWithPasskeysOptions = {}): Promise<PasskeyResult> {
    this.abortAllOperations()

    const deviceInfo = defaultDeviceInfo()

    // Default to email if usernameType is not provided
    if (!options.usernameType) {
      options.usernameType = 'email'
    }
  
    const authInitRequestBody: AuthInitRequestBody = {
      app: {
        id: this.config.appId,
        ...options.token && { token: options.token },
      },
      deviceInfo: deviceInfo,
      user: {
        username: username,
        usernameType: options.usernameType,
        ...options.displayName && { displayName: options.displayName },
      },
    }

    const authInitResponseBody = await this.service
      .auth
      .authAuthInit({ requestBody: authInitRequestBody })

    const authCompleteRequestBody = await this.getNavigatorCredential(authInitResponseBody, options)

    const result = await this.service
      .auth
      .authAuthComplete({ requestBody: authCompleteRequestBody })

    this.setJwtCookie(result.jwtAccess)

    return result
  }


  /**
   * Authenticates a user with a passkey.
   * @param {string} username Username to authenticate.
   * @param {AuthenticateWithPasskeysOptions} options Additional authentication options.
   * @returns {Promise<any>} Result of the authentication operation.
   */
  async enablePasskeyAutofill(options: AuthenticateWithPasskeysOptions = {}): Promise<PasskeyResult> {
    this.abortAllOperations()

    const deviceInfo = defaultDeviceInfo()

    // Abort signal override
    if (options.abortSignal) {
      options.abortSignal.addEventListener('abort', () => {
        this.abortAllOperations()
      })
    }

    const authInitRequestBody: AuthInitRequestBody = {
      app: {
        id: this.config.appId,
        ...options.token && { token: options.token },
      },
      deviceInfo: deviceInfo,
    }

    const authInitResponseBody = await this.service
      .auth
      .authAuthInit({ requestBody: authInitRequestBody })

    const authCompleteRequestBody = await this.getNavigatorCredential(authInitResponseBody, {
      autoFill: true,
      abortSignal: this.abortController.signal,
    })

    const result = await this.service
      .auth
      .authAuthComplete({ requestBody: authCompleteRequestBody })

    this.setJwtCookie(result.jwtAccess)

    return result
  }

  /**
   * Generates a code with passkey.
   * @param {string} username Username to authenticate.
   * @param {AuthenticateWithPasskeysOptions} options Additional authentication options.
   * @returns {Promise<AuthCode>} Code and expiry.
   */
  async generateCodeWithPasskey(username: string, options: AuthenticateWithPasskeysOptions = {}): Promise<AuthCode> {
    
    options.token = this.getToken(options)
    // if no token is found, perform authentication
    if (!options.token) {
      const result = await this.authenticateWithPasskey(username, options)
      // get token after authentication
      options.token = result.jwtAccess
    }

    const code: AuthCode = await this.service
      .auth
      .authAuthCodeRequest({
        authorization: options.token,
      })
  
    return code
  }
  
  /**
   * Authenticate with a code.
   * @param {string} username Username to authenticate.
   * @param {string} code code to authenticate.
   * @param {AuthenticateWithPasskeysOptions} options Additional authentication options.
   * @returns {Promise<any>} Result of the authentication operation.
   */
  async authenticateWithCode(username: string, code: string, options: AuthenticateWithPasskeysOptions = {}) {
    this.abortAllOperations()

    // Default to email if usernameType is not provided
    if (!options.usernameType) {
      options.usernameType = 'email'
    }
  
    const request: AuthCodeVerifyRequestBody = {
      authCode: code,
      user: {
        username: username,
        usernameType: options.usernameType,
      },
    }
  
    const result = await this.service
      .auth.authAuthCodeVerify({
        requestBody: request
      })

    this.setJwtCookie(result.jwtAccess)

    return result
  }

  /**
   * Add passkey
   * @param username Username to authenticate.
   * @param options Additional authentication options.
   * @returns {Promise<PasskeyResult>} Result of the add passkey operation.
   */
  async addPasskey(username: string, options: PasskeyOptions = {}): Promise<PasskeyResult> {
    const token = this.getToken(options)
    if (!token) {
      throw new Error(
        'User needs to be logged in to perform this operation.'
      )
    }
    options.token = token

    const result = await this.registerWithPasskey(username, options)

    return result
  }

  /**
   * Add passkey with code
   * @param username Username to authenticate.
   * @param code Code to authenticate.
   * @param options Additional authentication options.
   * @returns @returns {Promise<PasskeyResult>} Result of the add passkey with code operation.
   */
  async addPasskeyWithCode(username: string, code: string, options: PasskeyOptions = {}): Promise<PasskeyResult> {
    await this.authenticateWithCode(username, code, options)

    const result = await this.registerWithPasskey(username, options)

    return result
  }

  /**
   * Confirms a transaction using a passkey.
   * 
   * This method initiates a transaction confirmation process by generating a transaction-specific challenge 
   * and then expects the client to provide an assertion response using a passkey. 
   * This method is useful for confirming actions such as payments 
   * or changes to sensitive account information, ensuring that the transaction is being authorized 
   * by the rightful owner of the passkey.
   * 
   * @param {string} username The username of the user confirming the transaction.
   * @param {string} txPayload The transaction-specific payload, which could include details 
   * such as the transaction amount, recipient, and other metadata necessary for the transaction.
   * @param {ConfirmTransactionOptions} [options={}] Optional parameters for transaction confirmation.
   * @returns {Promise<any>} A promise that resolves with the result of the transaction confirmation operation. 
   * The result includes details about the transaction's details and includes a new JWT access token.
   */
  async confirmTransaction(username: string, txPayload: string, options: ConfirmTransactionOptions = {}) {
    this.abortAllOperations()
    
    const txInitRequestBody: TxInitRequestBody = {
      username: username,
      txPayload: txPayload,
      nonce: options.nonce || createUUID(),
      txType: options.txType || 'raw',
    }

    const {assertionOptions, session} = await this.service
      .tx
      .txTxInit({ requestBody: txInitRequestBody })

    const authInitResponseBody: AuthInit = {
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

    this.setJwtCookie(result.jwtAccess)

    return result
  }
}

export default Passkeys
