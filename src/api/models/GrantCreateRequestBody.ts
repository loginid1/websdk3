/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GrantCreateRequestBody = {
    /**
     * Grant type, i.e. what operation is permitted
     */
    grant: 'passkey:list' | 'passkey:create' | 'passkey:update' | 'passkey:delete' | 'user:delete';
    /**
     * User identifier
     */
    username?: string;
};

