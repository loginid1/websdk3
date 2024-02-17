import {base64UrlToBuffer} from '../utils'
import type {
  publicKeyCredentialCreationOptionsResponseBody,
} from '../api/models/publicKeyCredentialCreationOptionsResponseBody'
import type {
  publicKeyCredentialRequestOptionsResponseBody
} from '../api/models/publicKeyCredentialRequestOptionsResponseBody'
import { AuthenticateWithPasskeysOptions } from '..'

/**
 * Asynchronously creates a passkey credential using the provided registration response.
 *
 * @param {IRegisterPasskeyInitResponse} init - The registration initiation response.
 * @returns {Promise<PublicKeyCredential>} A promise that resolves to the passkey credential.
 * @throws {LoginIdError} If any errors occur during credential creation or if the credential type is invalid.
 */
const createPasskeyCredential = async (init: publicKeyCredentialCreationOptionsResponseBody): Promise<PublicKeyCredential> => {
  // Represents a list of public key credential descriptors (excludeCredentials).
  let excludeCredentials: PublicKeyCredentialDescriptor[] | undefined = undefined

  // Check if excludeCredentials is defined in the registration initiation response.
  if (init.excludeCredentials !== undefined) {
    // Initialize an empty array to store the transformed credentials.
    excludeCredentials = []

    // Iterate through the provided credentials and transform them.
    for (const cred of init.excludeCredentials) {
      // Create a new credential descriptor with transformed values.
      const transformedCred = {
        id: base64UrlToBuffer(cred.id), // Convert the credential ID from base64 URL to a buffer.
        transports: cred.transports, // Transport hints for the credential.
        type: cred.type, // Type of the credential (e.g., "public-key").
      }

      // Add the transformed credential descriptor to the excludeCredentials array.
      excludeCredentials.push(transformedCred)
    }
  }

  // Make TypeScript happy
  const pubKeyCredParams = init.pubKeyCredParams as PublicKeyCredentialParameters[]

  // Define options for creating the passkey credential.
  // TODO: Add hints
  const options: CredentialCreationOptions = {
    publicKey: {
      attestation: init.attestation,
      authenticatorSelection: {...init.authenticatorSelection},
      challenge: base64UrlToBuffer(init.challenge),
      excludeCredentials: excludeCredentials,
      extensions: init.extensions,
      pubKeyCredParams: pubKeyCredParams,
      rp: init.rp,
      timeout: init.timeout,
      user: {
        ...init.user,
        id: base64UrlToBuffer(init.user.id)
      },
    }
  }

  // Create the passkey credential using the Web Authentication API.
  const credential = await navigator.credentials.create(options)

  // Check if the credential creation was successful.
  if (credential === null) {
    throw new Error('Failed to create the passkey credential.')
  }

  // Check the type of the created credential.
  // [MDN Reference](https://developer.mozilla.org/docs/Web/API/Credential/type)
  // Valid values are `password`, `federated` and `public-key`.
  if (credential.type !== 'public-key') {
    throw new Error('The created credential has an invalid type.')
  }

  // Return the created passkey credential.
  return <PublicKeyCredential>credential
}

/**
 * Asynchronously retrieves a passkey credential for authentication using the provided request options.
 *
 * @param {publicKeyCredentialRequestOptionsResponseBody} init - The authentication initiation response.
 * @param {AuthenticateWithPasskeysOptions} options - Additional options for the authentication request.
 * @returns {Promise<PublicKeyCredential>} A promise that resolves to the passkey credential.
 */
const getPasskeyCredential = async (
  init: publicKeyCredentialRequestOptionsResponseBody,
  options: AuthenticateWithPasskeysOptions = {}
): Promise<PublicKeyCredential> => {
  // Represents a list of public key credential descriptors (allowCredentials).
  let allowCredentials: PublicKeyCredentialDescriptor[] | undefined = undefined

  // Check if allowCredentials is defined in the registration initiation response.
  if (init.allowCredentials !== undefined) {
    // Initialize an empty array to store the transformed credentials.
    allowCredentials = []

    // Iterate through the provided credentials and transform them.
    for (const cred of init.allowCredentials) {
      // Create a new credential descriptor with transformed values.
      const transformedCred = {
        id: base64UrlToBuffer(cred.id), // Convert the credential ID from base64 URL to a buffer.
        transports: cred.transports, // Transport hints for the credential.
        type: cred.type, // Type of the credential (e.g., "public-key").
      }

      // Add the transformed credential descriptor to the allowCredentials array.
      allowCredentials.push(transformedCred)
    }
  }

  // Define options for creating the passkey credential.
  // TODO: Add hints
  const credOptions: CredentialRequestOptions = {
    ...options.autoFill && { mediation: 'conditional' },
    ...options.abortSignal && { signal: options.abortSignal },
    publicKey: {
      allowCredentials: allowCredentials,
      challenge: base64UrlToBuffer(init.challenge),
      extensions: init.extensions,
      rpId: init.rpId,
      timeout: init.timeout,
      userVerification: init.userVerification,
    }
  }

  // Create the passkey credential using the Web Authentication API.
  const credential = await navigator.credentials.get(credOptions)

  // Check if the credential creation was successful.
  if (credential === null) {
    throw new Error('Failed to create the passkey credential.')
  }

  // Check the type of the created credential.
  // [MDN Reference](https://developer.mozilla.org/docs/Web/API/Credential/type)
  // Valid values are `password`, `federated` and `public-key`.
  if (credential.type !== 'public-key') {
    throw new Error('The created credential has an invalid type.')
  }

  // Return the created passkey credential.
  return <PublicKeyCredential>credential
}

// Export the function for external use.
export {
  createPasskeyCredential,
  getPasskeyCredential
}
