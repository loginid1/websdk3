// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { AuthenticatorAssertionResponse } from "./AuthenticatorAssertionResponse";
import type { CreationResult } from "./CreationResult";
/**
 * Passkey information associated with the completed MFA step.
 */
export type AdditionalPasskeyInfo = {
  /**
   * AAGUID identifying the passkey provider/authenticator model.
   */
  aaguid: string;
  assertionResult?: AuthenticatorAssertionResponse;
  creationResult?: CreationResult;
  /**
   * Internal passkey ID that uniquely identifies the passkey used.
   */
  passkeyId: string;
  /**
   * Base64url encoded COSE public key of the passkey's credential.
   */
  publicKey: string;
};
