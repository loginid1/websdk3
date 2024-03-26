/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Application making the request. It contains additional info about the caller
 * to distinguish between tenants.
 */
export type Application = {
    /**
     * Unique application id
     */
    id: string;
    /**
     * App authorization token signed with application key.
     */
    token?: string;
};

