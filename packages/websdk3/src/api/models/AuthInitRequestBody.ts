// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

import type { Application } from "./Application";
import type { DeviceInfo } from "./DeviceInfo";
import type { UserLogin } from "./UserLogin";
export type AuthInitRequestBody = {
  app: Application;
  deviceInfo: DeviceInfo;
  trustInfo?: string;
  user?: UserLogin;
};
