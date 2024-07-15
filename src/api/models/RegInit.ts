/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublicKeyCredentialCreationOptions } from './PublicKeyCredentialCreationOptions';
export type RegInit = {
    /**
     * An action to be performed by the front-end to complete the registration flow.
     */
    action: 'proceed' | 'signIn' | 'fail';
    registrationRequestOptions: PublicKeyCredentialCreationOptions;
    /**
     * An opaque object containing session data.
     */
    session: string;
};

