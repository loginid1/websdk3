/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PasskeysPasskeyRenameRequestBody } from '../models/PasskeysPasskeyRenameRequestBody';
import type { PasskeysPasskeyResponseCollection } from '../models/PasskeysPasskeyResponseCollection';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PasskeysService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List passkeys
     * **Required security scopes for jwt**:
     * * `passkey:read`
     * @returns PasskeysPasskeyResponseCollection OK response.
     * @throws ApiError
     */
    public passkeysPasskeysList({
        authorization,
    }: {
        /**
         * Authorization token
         */
        authorization?: string,
    }): CancelablePromise<PasskeysPasskeyResponseCollection> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/passkeys',
            headers: {
                'Authorization': authorization,
            },
            errors: {
                401: `Unauthorized response.`,
                403: `Forbidden response.`,
                500: `Internal Server Error response.`,
            },
        });
    }
    /**
     * Rename passkey
     * **Required security scopes for jwt**:
     * * `passkey:write`
     * @returns void
     * @throws ApiError
     */
    public passkeysPasskeyRename({
        id,
        passkeyRenameRequestBody,
        authorization,
    }: {
        /**
         * Internal passkey identifier
         */
        id: string,
        passkeyRenameRequestBody: PasskeysPasskeyRenameRequestBody,
        /**
         * Authorization token
         */
        authorization?: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/passkeys/{id}',
            path: {
                'id': id,
            },
            headers: {
                'Authorization': authorization,
            },
            body: passkeyRenameRequestBody,
            errors: {
                401: `Unauthorized response.`,
                403: `Forbidden response.`,
                404: `Not Found response.`,
                500: `Internal Server Error response.`,
            },
        });
    }
    /**
     * Delete passkey
     * **Required security scopes for jwt**:
     * * `passkey:write`
     * @returns void
     * @throws ApiError
     */
    public passkeysPasskeyDelete({
        id,
        authorization,
    }: {
        /**
         * Internal passkey identifier
         */
        id: string,
        /**
         * Authorization token
         */
        authorization?: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/passkeys/{id}',
            path: {
                'id': id,
            },
            headers: {
                'Authorization': authorization,
            },
            errors: {
                401: `Unauthorized response.`,
                403: `Forbidden response.`,
                404: `Not Found response.`,
                500: `Internal Server Error response.`,
            },
        });
    }
}
