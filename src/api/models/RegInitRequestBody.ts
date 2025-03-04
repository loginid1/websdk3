/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Application } from './Application';
import type { DeviceInfo } from './DeviceInfo';
import type { PasskeyOptions } from './PasskeyOptions';
import type { User } from './User';
export type RegInitRequestBody = {
    app: Application;
    deviceInfo: DeviceInfo;
    passkeyOptions?: PasskeyOptions;
    trustInfo?: string;
    user?: User;
};

