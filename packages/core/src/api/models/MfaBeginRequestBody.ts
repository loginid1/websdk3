// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { DeviceInfo } from "./DeviceInfo";
import type { MfaUser } from "./MfaUser";
export type MfaBeginRequestBody = {
  deviceInfo?: DeviceInfo;
  /**
   * Payload to be signed
   */
  payload?: string;
  traceId?: string;
  /**
   * TrustIDs provided with the request
   */
  trustItems?: Record<string, string>;
  user?: MfaUser;
};
