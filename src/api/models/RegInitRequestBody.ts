/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Application } from './Application';
import type { DeviceInfo } from './DeviceInfo';
import type { User } from './User';
export type RegInitRequestBody = {
    app: Application;
    deviceInfo: DeviceInfo;
    /**
     * Set of authentication factors:
     * - Single factor: Username (i.e. email or phone) + FIDO2 credential;
     * - Two factor: Username + password + FIDO2 credential;
     * - Passwordless: FIDO2 discoverable credentials;
     * - Passwordless + MFA: FIDO2 discoverable credentials + PIN;
     */
    mfa?: Array<'fido2' | 'email' | 'phone' | 'password' | 'pin'>;
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

