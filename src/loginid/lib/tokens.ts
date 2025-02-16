import { TrustIDClaims } from '../types'
import { b2a, base64EncodeUrl, generateRandomId, signWithES256PrivateKey } from '../../utils'

/**
 * Creates a Trust ID payload with the given parameters.
 * @param {string} appId - The app ID.
 * @param {string} username - The username for the trust ID.
 * @param {string} challenge - The challenge string.
 * @param {string} id - The unique identifier for the trust ID (optional).
 * @param {JsonWebKey} [jwk] - The JSON Web Key (optional).
 * @returns {TrustIDClaims} The Trust ID payload.
 */
const toTrustIDPayload = (
  appId: string,
  username: string,
  challenge: string,
  id: string,
  jwk?: JsonWebKey,
): TrustIDClaims => {
  if (!id) {
    id = generateRandomId()
  }

  const payload: TrustIDClaims = {
    sub: id,
    username: username,
    chal: challenge,
    aud: appId,
    ...jwk && { jwk: JSON.stringify(jwk) },
  }

  return payload
}

/**
 * Signs a Trust ID token using an ES256 private key.
 * @param {TrustIDClaims} payload - The payload to sign.
 * @param {CryptoKey} privateKey - The private key used for signing.
 * @returns {Promise<string>} The signed JWT Trust ID.
 */
const signWithTrustId = async (payload: TrustIDClaims, privateKey: CryptoKey): Promise<string> => {
  const header = {
    alg: 'ES256',
    kid: payload.sub,
    typ: 'JWT',
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
