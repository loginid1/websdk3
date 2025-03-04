import { TrustIDClaims } from '../types'
import { b2a, base64EncodeUrl, generateRandomId, signWithES256PrivateKey } from '../../utils'

/**
 * Creates a Trust ID payload with the given parameters.
 * @param {string} appId - The app ID.
 * @param {string} username - The username for the trust ID.
 * @param {string} [id] - The ID for the trust ID.
 * @returns {TrustIDClaims} The Trust ID payload.
 */
const toTrustIDPayload = (
  appId: string,
  username: string,
  id?: string,
): TrustIDClaims => {
  if (!id) {
    id = generateRandomId()
  }

  const payload: TrustIDClaims = {
    id: id,
    username: username,
    aud: appId,
  }

  return payload
}

/**
 * Signs a Trust ID token using an ES256 private key.
 * @param {TrustIDClaims} payload - The payload to sign.
 * @param {JsonWebKey} publicKeyJwk - The public key associated with the private key.
 * @param {CryptoKey} privateKey - The private key used for signing.
 * @returns {Promise<string>} The signed JWT Trust ID.
 */
const signWithTrustId = async (
  payload: TrustIDClaims,
  publicKeyJwk: JsonWebKey,
  privateKey: CryptoKey,
): Promise<string> => {
  const header = {
    alg: 'ES256',
    jwk: publicKeyJwk,
  }

  const encodedHeader = base64EncodeUrl(b2a(JSON.stringify(header)))
  const encodedPayload = base64EncodeUrl(b2a(JSON.stringify(payload)))
  const unsignedToken = `${encodedHeader}.${encodedPayload}`
  const signature = await signWithES256PrivateKey(privateKey, unsignedToken)

  return `${unsignedToken}.${signature}`
}

export {
  signWithTrustId,
  toTrustIDPayload,
}
