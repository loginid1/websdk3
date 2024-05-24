/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EmailVerifyRequestBody = {
    /**
     * Verification code
     */
    code: string;
    /**
     * Purpose of the verification code
     */
    purpose: 'addCred' | 'tempAuth';
    /**
     * User identifier
     */
    username: string;
};

