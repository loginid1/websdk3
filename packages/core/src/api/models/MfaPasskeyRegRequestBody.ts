// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { CreationResult } from "./CreationResult";
export type MfaPasskeyRegRequestBody = {
  creationResult: CreationResult;
  /**
   * Identity provider parameters (e.g., Mitek verification data).
   */
  providerParams?: Record<string, string>;
};
