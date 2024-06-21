/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublicKeyCredentialRequestOptions } from './PublicKeyCredentialRequestOptions';
export type AuthInit = {
    assertionOptions: PublicKeyCredentialRequestOptions;
    /**
     * List of fallback methods (in priority order) available to this client.
     */
    fallbackOptions?: Array<'otp:client' | 'otp:email' | 'otp:sms'>;
    /**
     * Match score of the device
     */
    matchScore?: number;
    /**
     * Type of passkey supported by the client.
     */
    passkeyType?: string;
    /**
     * An opaque object containing session data.
     */
    session: string;
};

