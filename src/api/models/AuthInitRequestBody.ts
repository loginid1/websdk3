/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Application } from './Application';
import type { DeviceInfo } from './DeviceInfo';
import type { UserLogin } from './UserLogin';
export type AuthInitRequestBody = {
    app: Application;
    deviceInfo: DeviceInfo;
    user?: UserLogin;
};

