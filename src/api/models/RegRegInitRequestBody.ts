/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { applicationRequestBody } from './applicationRequestBody';
import type { deviceInfoRequestBody } from './deviceInfoRequestBody';
import type { userRequestBody } from './userRequestBody';
export type RegRegInitRequestBody = {
    app: applicationRequestBody;
    deviceInfo: deviceInfoRequestBody;
    /**
     * Set of authentication factors:
     * - Single factor: Username (i.e. email or phone) + FIDO2 credential;
     * - Two factor: Username + password + FIDO2 credential;
     * - Passwordless: FIDO2 discoverable credentials;
     * - Passwordless + MFA: FIDO2 discoverable credentials + PIN;
     */
    mfa?: Array<'fido2' | 'email' | 'phone' | 'password' | 'pin'>;
    user: userRequestBody;
};

