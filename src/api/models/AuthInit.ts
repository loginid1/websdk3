/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublicKeyCredentialRequestOptions } from './PublicKeyCredentialRequestOptions';
export type AuthInit = {
    /**
     * An action to be performed by the front-end to complete the authentication flow.
     */
    action: 'proceed' | 'affirm' | 'fallback';
    /**
     * List of cross authentication methods in the order of preference
     */
    affirmMethods: Array<'otp' | 'otp:sms' | 'otp:email'>;
    assertionOptions: PublicKeyCredentialRequestOptions;
    /**
     * The list contains available fallback methods in the order of preference. The
     * list is dynamic and shall not be cached. The default fallback mechanism is
     * the one provided by CIAM but our system may provide additional ones as well.
     * These methods may be enabled by customer via application configuration but
     * they are disabled by default. The list may be empty which means no fallback
     * is available and authentication flow shall terminate at this point.
     */
    fallbackMethods: Array<'ciam'>;
    /**
     * Type of passkey supported by the client.
     */
    passkeyType?: string;
    /**
     * An opaque object containing session data.
     */
    session: string;
};

