/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthCompleteRequestBody } from '../models/AuthCompleteRequestBody';
import type { AuthInit } from '../models/AuthInit';
import type { AuthInitRequestBody } from '../models/AuthInitRequestBody';
import type { JWT } from '../models/JWT';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Complete WebAuthn registration
     * @returns JWT OK response.
     * @throws ApiError
     */
    public authAuthComplete({
        requestBody,
    }: {
        requestBody: AuthCompleteRequestBody,
    }): CancelablePromise<JWT> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/auth/complete',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `BadRequest: Bad Request response.`,
                403: `Forbidden: Forbidden response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
    /**
     * Start WebAuthn registration flow
     * @returns AuthInit OK response.
     * @throws ApiError
     */
    public authAuthInit({
        requestBody,
        userAgent,
    }: {
        requestBody: AuthInitRequestBody,
        /**
         * Raw user-agent header as set by a browser
         */
        userAgent?: string,
    }): CancelablePromise<AuthInit> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/auth/init',
            headers: {
                'User-Agent': userAgent,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `BadRequest: Bad Request response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
}
