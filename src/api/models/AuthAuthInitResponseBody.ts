/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { publicKeyCredentialRequestOptionsResponseBody } from './publicKeyCredentialRequestOptionsResponseBody';
/**
 * AuthInitResponseBody result type (default view)
 */
export type AuthAuthInitResponseBody = {
    assertionOptions: publicKeyCredentialRequestOptionsResponseBody;
    /**
     * An opaque object containing session data.
     */
    session: string;
};

