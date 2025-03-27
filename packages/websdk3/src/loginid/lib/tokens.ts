// Copyright (C) LoginID

import {
  b2a,
  base64EncodeUrl,
  generateRandomId,
  signWithES256PrivateKey,
} from "../../utils";
import { TrustIDClaims } from "../types";

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
    id = generateRandomId();
  }

  const payload: TrustIDClaims = {
    id: id,
    username: username,
    aud: appId,
  };

  return payload;
};

/**
 * Signs a token payload using an ES256 private key.
 * @param {Record<string, any>} payload - The payload to sign.
 * @param {JsonWebKey} publicKeyJwk - The public key associated with the private key.
 * @param {CryptoKey} privateKey - The private key used for signing.
 * @returns {Promise<string>} The signed JWT.
 */
const signJwtWithJwk = async (
  payload: Record<string, any>,
  publicKeyJwk: JsonWebKey,
  privateKey: CryptoKey,
): Promise<string> => {
  const header = {
    alg: "ES256",
    jwk: publicKeyJwk,
  };

  const encodedHeader = base64EncodeUrl(b2a(JSON.stringify(header)));
  const encodedPayload = base64EncodeUrl(b2a(JSON.stringify(payload)));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = await signWithES256PrivateKey(privateKey, unsignedToken);

  return `${unsignedToken}.${signature}`;
};

export { signJwtWithJwk, toTrustIDPayload };
