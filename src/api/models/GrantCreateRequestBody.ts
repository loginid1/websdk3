/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GrantCreateRequestBody = {
    /**
     * List of requested grants
     */
    grants: Array<'passkey:read' | 'passkey:write' | 'profile:read' | 'profile:write' | 'self:write'>;
    /**
     * User identifier
     */
    username?: string;
};

