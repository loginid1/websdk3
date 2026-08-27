// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { AuthenticatorAssertionResponse } from "./AuthenticatorAssertionResponse";
export type AuthCompleteRequestBody = {
  assertionResult: AuthenticatorAssertionResponse;
  /**
   * This attribute contains the authenticator data returned by the authenticator.
   */
  authenticatorData?: string;
  /**
   * An opaque object containing session data.
   */
  session: string;
  /**
   * Base64 encoded the raw signature returned from the authenticator.
   */
  signature?: string;
};
