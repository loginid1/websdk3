// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { AuthenticatorAssertionResponse } from "./AuthenticatorAssertionResponse";
export type MfaPasskeyAuthRequestBody = {
  assertionResult: AuthenticatorAssertionResponse;
  /**
   * Identity provider parameters (e.g., Mitek verification data).
   */
  providerParams?: Record<string, string>;
};
