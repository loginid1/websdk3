/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileEmailUpdateRequestBody = {
    /**
     * Email address
     */
    email: string;
    /**
     * Whether to update the email address immediately or send an authorization code
     * to verify.
     */
    requestVerification?: boolean;
};

