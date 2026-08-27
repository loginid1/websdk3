// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { Passkey } from "./Passkey";
export type JWT = {
  authCred?: Passkey;
  /**
   * Device ID
   */
  deviceId: string;
  /**
   * JWT access token
   */
  jwtAccess: string;
  /**
   * Passkey ID
   */
  passkeyId: string;
  /**
   * Transaction ID
   */
  txId?: string;
  /**
   * User ID
   */
  userId: string;
};
