/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthAuthCompleteRequestBody } from '../models/AuthAuthCompleteRequestBody';
import type { AuthAuthCompleteResponseBody } from '../models/AuthAuthCompleteResponseBody';
import type { AuthAuthInitRequestBody } from '../models/AuthAuthInitRequestBody';
import type { AuthAuthInitResponseBody } from '../models/AuthAuthInitResponseBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Complete WebAuthn registration
     * @returns AuthAuthCompleteResponseBody OK response.
     * @throws ApiError
     */
    public authAuthComplete({
        authCompleteRequestBody,
    }: {
        authCompleteRequestBody: AuthAuthCompleteRequestBody,
    }): CancelablePromise<AuthAuthCompleteResponseBody> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/complete',
            body: authCompleteRequestBody,
            errors: {
                400: `Bad Request response.`,
                403: `Forbidden response.`,
                500: `Internal Server Error response.`,
            },
        });
    }
    /**
     * Start WebAuthn registration flow
     * @returns AuthAuthInitResponseBody OK response.
     * @throws ApiError
     */
    public authAuthInit({
        authInitRequestBody,
    }: {
        authInitRequestBody: AuthAuthInitRequestBody,
    }): CancelablePromise<AuthAuthInitResponseBody> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/init',
            body: authInitRequestBody,
            errors: {
                400: `Bad Request response.`,
                403: `Forbidden response.`,
                500: `Internal Server Error response.`,
            },
        });
    }
}
