import LoginIDBase from './base'
import { defaultDeviceInfo } from '../browser'
import { bufferToBase64Url, createUUID } from '../utils'
import { createPasskeyCredential, getPasskeyCredential } from '../webauthn/'
import type {
  AuthenticateWithPasskeysOptions,
  CodePurpose,
  ConfirmTransactionOptions,
  LoginIDConfig,
  PasskeyResult,
  RegisterWithPasskeyOptions,
  Transports
} from './types'
import {
  AuthCodeRequestBody,
  AuthCompleteRequestBody,
  AuthInit,
  AuthInitRequestBody,
  JWT,
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
  private jwtAccess: string = ''

  /**
   * Initializes a new Passkeys instance with the provided configuration.
   * @param {LoginIDConfig} config Configuration object for LoginID.
   */
  constructor(config: LoginIDConfig) {
    super(config)
  }

  /**
   * Creates a navigator credential using WebAuthn.
   * @param {RegInit} regInitResponseBody The response body from registration initialization.
   * @returns {Promise<RegRegCompleteRequestBody>} Completion request body for registration.
   */
  async createNavigatorCredential(regInitResponseBody: RegInit) {
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
    const deviceInfo = defaultDeviceInfo()

    // Default to email if usernameType is not provided
    if (!options.usernameType) {
      options.usernameType = 'email'
    }

    const regInitRequestBody: RegInitRequestBody = {
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
      ...options.mfa && { mfa: options.mfa },
      ...options.session && { session: options.session },
    }

    const regInitResponseBody = await this.service
      .reg
      .regRegInit({ requestBody: regInitRequestBody })

    const regCompleteRequestBody = await this.createNavigatorCredential(regInitResponseBody)

    const result = await this.service
      .reg
      .regRegComplete({ requestBody: regCompleteRequestBody })

    this.jwtAccess = result.jwtAccess

    return result
  }

  /**
   * Retrieves a navigator credential for authentication.
   * @param {AuthInit} authInitResponseBody The response body from authentication initialization.
   * @param {AuthenticateWithPasskeysOptions} options Additional options for authentication.
   * @returns {Promise<AuthAuthCompleteRequestBody>} Completion request body for authentication.
   */
  async getNavigatorCredential(authInitResponseBody: AuthInit, options: AuthenticateWithPasskeysOptions = {}) {
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
    const deviceInfo = defaultDeviceInfo()

    // Default to email if usernameType is not provided
    if (!options.usernameType) {
      options.usernameType = 'email'
    }

    console.log(options)

    const authInitRequestBody: AuthInitRequestBody = {
      app: {
        id: this.config.appId,
        ...options.token && { token: options.token },
      },
      ...options.codePurpose && { codePurpose: options.codePurpose },
      deviceInfo: deviceInfo,
      ...!options.autoFill && { user: {
        username: username,
        usernameType: options.usernameType,
        ...options.displayName && { displayName: options.displayName },
      }},
    }

    const authInitResponseBody = await this.service
      .auth
      .authAuthInit({ requestBody: authInitRequestBody })

    const authCompleteRequestBody = await this.getNavigatorCredential(authInitResponseBody, options)

    const result = await this.service
      .auth
      .authAuthComplete({ requestBody: authCompleteRequestBody })

    this.jwtAccess = result.jwtAccess

    return result
  }

  /**
   * Generates a code with passkey.
   * @param {string} username Username to authenticate.
   * @param {CodePurpose} codePurpose Used to determine if code is for one time authentcation or to add a credential.
   * @param {AuthenticateWithPasskeysOptions} options Additional authentication options.
   * @returns {Promise<any>} Result of the authentication operation.
   */
  async generateCodeWithPasskey(username: string, codePurpose: CodePurpose, options: AuthenticateWithPasskeysOptions = {}): Promise<JWT> {
    options.codePurpose = codePurpose

    const result: JWT = await this.authenticateWithPasskey(username, options)
  
    return result
  }
  
  /**
   * Authenticate with a code.
   * @param {string} username Username to authenticate.
   * @param {string} code code to authenticate.
   * @param {AuthenticateWithPasskeysOptions} options Additional authentication options.
   * @returns {Promise<any>} Result of the authentication operation.
   */
  async authenticateWithCode(username: string, code: string, options: AuthenticateWithPasskeysOptions = {}) {
    // Default to email if usernameType is not provided
    if (!options.usernameType) {
      options.usernameType = 'email'
    }
  
    const request: AuthCodeRequestBody = {
      code: code,
      user: {
        username: username,
        usernameType: options.usernameType,
        ...options.displayName && { displayName: options.displayName },
      },
    }
  
    const result = await this.service
      .auth.authAuthCode({
        requestBody: request
      })

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

    this.jwtAccess = result.jwtAccess

    return result
  }

  /**
   * Retrieves the JWT access token.
   * @returns {string} The JWT access token.
   */
  public getJWTAccess() {
    return this.jwtAccess
  }
}

export default Passkeys
