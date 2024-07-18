import { bufferToBase64Url } from '../utils'
import { createPasskeyCredential, getPasskeyCredential } from '../loginid/lib/webauthn'
import { AuthenticateWithPasskeysOptions, Transports } from '../loginid/types'
import { AuthCompleteRequestBody, AuthInit, RegCompleteRequestBody, RegInit } from '../api'

export class WebAuthnHelper {

  /**
   * Retrieves a navigator credential for authentication.
   * @param {AuthInit} authInitResponseBody The response body from authentication initialization.
   * @param {AuthenticateWithPasskeysOptions} options Additional options for authentication.
   * @returns {Promise<AuthAuthCompleteRequestBody>} Completion request body for authentication.
   */
  static async getNavigatorCredential(authInitResponseBody: AuthInit, options: AuthenticateWithPasskeysOptions = {}) {
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
   * Creates a navigator credential using WebAuthn.
   * @param {RegInit} regInitResponseBody The response body from registration initialization.
   * @returns {Promise<RegRegCompleteRequestBody>} Completion request body for registration.
   */
  static async createNavigatorCredential(regInitResponseBody: RegInit) {
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
}
