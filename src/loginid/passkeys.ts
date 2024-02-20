import LoginIDBase from './base'
import { bufferToBase64Url } from '../utils'
import { defaultDeviceInfo } from '../browser'
import { createPasskeyCredential, getPasskeyCredential } from '../webauthn/'
import type {
  AuthenticateWithPasskeysOptions,
  LoginIDConfig,
  PasskeyResult,
  RegisterWithPasskeyOptions,
  Transports
} from './types'
import {
  AuthAuthCompleteRequestBody,
  AuthAuthInitRequestBody,
  AuthAuthInitResponseBody,
  RegRegCompleteRequestBody,
  RegRegInitRequestBody,
  RegRegInitResponseBody,
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
   * @param {RegRegInitResponseBody} regInitResponseBody The response body from registration initialization.
   * @returns {Promise<RegRegCompleteRequestBody>} Completion request body for registration.
   */
  async createNavigatorCredential(regInitResponseBody: RegRegInitResponseBody) {
    const { registrationRequestOptions, session } = regInitResponseBody

    const credential = await createPasskeyCredential(registrationRequestOptions)
    const response = credential.response as AuthenticatorAttestationResponse

    const publicKey = response.getPublicKey && response.getPublicKey()
    const publicKeyAlg = response.getPublicKeyAlgorithm && response.getPublicKeyAlgorithm()
    const authenticatorData = response.getAuthenticatorData && response.getAuthenticatorData()
    const transports = response.getTransports && response.getTransports() as Transports

    const regCompleteRequestBody: RegRegCompleteRequestBody = {
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
    let deviceInfo = options.deviceInfo
    if (!deviceInfo) {
      deviceInfo = defaultDeviceInfo()
    }

    const regInitRequestBody: RegRegInitRequestBody = {
      app: {
        id: this.config.appId,
        name: '',
        ...options.token && { token: options.token },
      },
      deviceInfo: deviceInfo,
      user: {
        username: username,
        ...options.displayName && { displayName: options.displayName },
        ...options.usernameType && { usernameType: options.usernameType }
      },
      ...options.mfa && { mfa: options.mfa }
    }

    const regInitResponseBody = await this.service
      .reg
      .regRegInit({ regInitRequestBody })

    const regCompleteRequestBody = await this.createNavigatorCredential(regInitResponseBody)

    const result = await this.service
      .reg
      .regRegComplete({ regCompleteRequestBody })

    this.jwtAccess = result.jwtAccess

    return result
  }

  /**
   * Retrieves a navigator credential for authentication.
   * @param {AuthAuthInitResponseBody} authInitResponseBody The response body from authentication initialization.
   * @param {AuthenticateWithPasskeysOptions} options Additional options for authentication.
   * @returns {Promise<AuthAuthCompleteRequestBody>} Completion request body for authentication.
   */
  async getNavigatorCredential(authInitResponseBody: AuthAuthInitResponseBody, options: AuthenticateWithPasskeysOptions = {}) {
    const { assertionOption, session } = authInitResponseBody

    const credential = await getPasskeyCredential(assertionOption, options)
    const response = credential.response as AuthenticatorAssertionResponse

    const authCompleteRequestBody: AuthAuthCompleteRequestBody = {
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
  async authenticateWithPasskey(username: string, options: AuthenticateWithPasskeysOptions = {}): Promise<PasskeyResult> {
    let deviceInfo = options.deviceInfo
    if (!deviceInfo) {
      deviceInfo = defaultDeviceInfo()
    }

    const authInitRequestBody: AuthAuthInitRequestBody = {
      app: {
        id: this.config.appId,
        name: '',
        ...options.token && { token: options.token },
      },
      deviceInfo: deviceInfo,
      user: {
        //need to consider usernameless
        username: username,
        ...options.displayName && { displayName: options.displayName },
        ...options.usernameType && { usernameType: options.usernameType }
      },
    }

    const authInitResponseBody = await this.service
      .auth
      .authAuthInit({ authInitRequestBody })

    const authCompleteRequestBody = await this.getNavigatorCredential(authInitResponseBody)

    const result = await this.service
      .auth
      .authAuthComplete({ authCompleteRequestBody })

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
