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
    user: User;
};

