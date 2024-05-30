/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PasskeyCollection } from '../models/PasskeyCollection';
import type { PasskeyRenameRequestBody } from '../models/PasskeyRenameRequestBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PasskeysService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List passkeys
     * @returns PasskeyCollection OK response.
     * @throws ApiError
     */
    public passkeysPasskeysList(): CancelablePromise<PasskeyCollection> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/fido2/v2/passkeys',
            errors: {
                401: `Unauthorized: Unauthorized response.`,
                403: `Forbidden: Forbidden response.`,
                404: `NotFound: Not Found response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
    /**
     * Delete passkey
     * @returns void
     * @throws ApiError
     */
    public passkeysPasskeyDelete({
        id,
    }: {
        /**
         * Internal passkey identifier
         */
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/fido2/v2/passkeys/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `BadRequest: Bad Request response.`,
                401: `Unauthorized: Unauthorized response.`,
                403: `Forbidden: Forbidden response.`,
                404: `NotFound: Not Found response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
    /**
     * Rename passkey
     * @returns void
     * @throws ApiError
     */
    public passkeysPasskeyRename({
        id,
        requestBody,
    }: {
        /**
         * Internal passkey identifier
         */
        id: string,
        requestBody: PasskeyRenameRequestBody,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/fido2/v2/passkeys/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `BadRequest: Bad Request response.`,
                401: `Unauthorized: Unauthorized response.`,
                403: `Forbidden: Forbidden response.`,
                404: `NotFound: Not Found response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
}
