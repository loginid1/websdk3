// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { CreationResult } from "./CreationResult";
export type RegCompleteRequestBody = {
  creationResult: CreationResult;
  /**
   * An opaque object containing session data.
   */
  session: string;
};
