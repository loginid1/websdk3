/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GrantCreateRequestBody } from '../models/GrantCreateRequestBody';
import type { GrantCreateResponseBody } from '../models/GrantCreateResponseBody';
import type { TokenVerifyRequestBody } from '../models/TokenVerifyRequestBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MgmtService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create an authorization token for use with /reg/init call
     * @returns GrantCreateResponseBody OK response.
     * @throws ApiError
     */
    public mgmtGrantCreate({
        requestBody,
    }: {
        requestBody: GrantCreateRequestBody,
    }): CancelablePromise<GrantCreateResponseBody> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/mgmt/grant',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `BadRequest: Bad Request response.`,
                401: `Unauthorized: Unauthorized response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
    /**
     * Validate JWT Access Token
     * @returns void
     * @throws ApiError
     */
    public mgmtTokenVerify({
        requestBody,
    }: {
        requestBody: TokenVerifyRequestBody,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/mgmt/token/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `BadRequest: Bad Request response.`,
                401: `Unauthorized: Unauthorized response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
    /**
     * Delete a user and all associated passkey
     * @returns void
     * @throws ApiError
     */
    public mgmtUserDelete({
        id,
    }: {
        /**
         * Internal user identifier
         */
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/fido2/v2/mgmt/user/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `BadRequest: Bad Request response.`,
                401: `Unauthorized: Unauthorized response.`,
                404: `NotFound: Not Found response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
}
