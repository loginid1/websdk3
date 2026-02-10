// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

export type MfaDiscoverRequestBody = {
  /**
   * TrustIDs provided with the request
   */
  trustItems: Record<string, string>;
};
