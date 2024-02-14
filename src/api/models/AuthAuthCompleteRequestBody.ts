/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { authenticatorAssertionResponseRequestBody } from './authenticatorAssertionResponseRequestBody';
export type AuthAuthCompleteRequestBody = {
    assertionResult: authenticatorAssertionResponseRequestBody;
    /**
     * An opaque object containing session data.
     */
    session: string;
};

