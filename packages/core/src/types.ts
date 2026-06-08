// Copyright (C) LoginID

import { AdditionalPasskeyInfo, CreationResult } from "./api";

export type Transports = CreationResult["transports"];

export interface GetNavigatorCredentialOptions {
  autoFill?: boolean;
  abortController?: AbortController;
}

export interface GetPasskeyCredentialOptions {
  autoFill?: boolean;
  abortController?: AbortController;
}

export interface AuthzTokenOptions {
  authzToken?: string;
}

/**
 * General information about the current user session. Information is obtained from the stored authorization token.
 */
export interface SessionInfo {
  /**
   * Current authenticated user's username.
   */
  username: string;

  /**
   * Current authenticated user's ID.
   */
  id: string;

  /**
   * Relying party ID used typically used for passkey authentication to confirm the user has signed in under the specific domain.
   */
  rpId: string;
}

/**
 * Represents a stored checkout ID record.
 */
export interface CheckoutIDRecord {
  /**
   * Unique identifier for the checkout ID, derived from the checkout ID token.
   */
  id: string;

  /**
   * Cryptographic key pair used for signing and verification.
   */
  keyPair: CryptoKeyPair;

  /**
   * Indicates if the checkout ID has successfully been completed.
   */
  valid: boolean;
}

/**
 * Represents the claims included in a TrustID token.
 */
export interface TrustIDClaims {
  /**
   * Unique identifier for the Trust ID.
   */
  id: string;

  /**
   * Expiration time of the Trust ID token, represented as a Unix timestamp.
   */
  exp: number;
}

/**
 * Represents a stored Trust ID record in the trust store database.
 */
export interface TrustIDRecord {
  /**
   * Unique identifier for the Trust ID, derived from the TrustID token.
   */
  id: string;

  /**
   * Username associated with the Trust ID.
   */
  username: string;

  /**
   * Cryptographic key pair used for signing and verification.
   */
  keyPair: CryptoKeyPair;
}

/**
 * A set of checkout trust tokens.
 */
export interface LoginIDTrustSet {
  /**
   * The merchant trust ID.
   */
  merchantTrustId?: string;

  /**
   * The wallet trust ID.
   */
  walletTrustId?: string;
}

/**
 * A set of tokens obtained upon login.
 */
export interface LoginIDTokenSet {
  /**
   * The ID token representing the authenticated session.
   */
  idToken: string;

  /**
   * The access token used for authorization.
   */
  accessToken: string;

  /**
   * The refresh token used to obtain new access tokens.
   */
  refreshToken: string;

  /**
   * A JSON Web Signature (JWS) that provides cryptographic proof of the payload's integrity.
   * Ensures that the authentication data has not been tampered with.
   */
  payloadSignature?: string;
}

/**
 * An extended set of tokens obtained upon login, with optional authentication details.
 */
export type MfaData = LoginIDTokenSet & {
  authenticationDetails?: AdditionalPasskeyInfo;
};

/**
 * Represents the result of a passkey credential creation.
 */
export interface PasskeyCreationResult {
  /**
   * Base64URL-encoded attestation object bytes.
   */
  attestationObject: string;

  /**
   * Base64URL-encoded authenticator data bytes.
   */
  authenticatorData?: string;

  /**
   * Base64URL-encoded UTF-8 JSON bytes representing the client data.
   * Decoding yields the original clientDataJSON string.
   */
  clientDataJSON: string;

  /**
   * Base64URL-encoded credential ID bytes.
   */
  credentialId: string;

  /**
   * Base64URL-encoded DER SubjectPublicKeyInfo bytes.
   */
  publicKey?: string;

  /**
   * This operation returns the COSEAlgorithmIdentifier of the new credential.
   */
  publicKeyAlgorithm?: number;

  /**
   * These values are the transports that the authenticator is believed to support,
   * or an empty sequence if the information is unavailable.
   */
  transports?: Transports;
}

/**
 * Represents the result of a passkey assertion.
 */
export interface PasskeyAssertionResponse {
  /**
   * Base64URL-encoded authenticator data bytes.
   */
  authenticatorData: string;

  /**
   * Base64URL-encoded UTF-8 JSON bytes representing the client data.
   */
  clientDataJSON: string;

  /**
   * Base64URL-encoded credential ID bytes.
   */
  credentialId: string;

  /**
   * Base64URL-encoded signature bytes returned by the authenticator.
   */
  signature: string;

  /**
   * User handle returned from the authenticator.
   */
  userHandle?: string;
}

/**
 * Represents additional information about a passkey.
 */
export interface PasskeyInfo {
  /**
   * AAGUID identifying the passkey provider/authenticator model.
   */
  aaguid: string;

  /**
   * The result of the passkey assertion.
   */
  assertionResult?: PasskeyAssertionResponse;

  /**
   * The result of the passkey creation.
   */
  creationResult?: PasskeyCreationResult;

  /**
   * Internal passkey ID which is used for [passkey management](https://docs.loginid.io/user-scenario/user-profile-management/passkey-management/).
   */
  passkeyId: string;

  /**
   * Base64URL-encoded COSE public key of the passkey's credential.
   */
  publicKey: string;
}
