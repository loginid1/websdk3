// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

export type MfaUser = {
  /**
   * Display Name
   */
  displayName?: string;
  /**
   * Full name for SNA evaluation
   */
  name?: string;
  /**
   * Phone number for SNA evaluation
   */
  phone?: string;
  username: string;
  usernameType: string;
};
