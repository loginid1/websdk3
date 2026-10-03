// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { Application } from "./Application";
import type { DeviceInfo } from "./DeviceInfo";
import type { TxPayload } from "./TxPayload";
import type { UserLogin } from "./UserLogin";
export type AuthInitRequestBody = {
  app: Application;
  deviceInfo: DeviceInfo;
  traceId?: string;
  /**
   * TrustIDs provided with the request
   */
  trustItems?: Record<string, string>;
  tx?: TxPayload;
  user?: UserLogin;
};
