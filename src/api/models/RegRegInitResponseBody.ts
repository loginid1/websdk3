/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { publicKeyCredentialCreationOptionsResponseBody } from './publicKeyCredentialCreationOptionsResponseBody';
/**
 * RegInitResponseBody result type (default view)
 */
export type RegRegInitResponseBody = {
    registrationRequestOptions: publicKeyCredentialCreationOptionsResponseBody;
    /**
     * An opaque object containing session data.
     */
    session: string;
};

