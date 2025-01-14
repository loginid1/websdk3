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
    /**
     * An opaque object containing user data. It is used in place of "user" attribute
     * for creating passkeys for pre-authorized users ("user" attribute is ignored if
     * session is present). The value of this attribute is generated by this service
     * and require backend integration for obtaining it. This value is time sensitive
     * and has rather short expiry.
     */
    session?: string;
    user?: User;
};

