/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthenticatorAssertionResponse } from './AuthenticatorAssertionResponse';
export type AuthCompleteRequestBody = {
    assertionResult: AuthenticatorAssertionResponse;
    /**
     * An opaque object containing session data.
     */
    session: string;
};

