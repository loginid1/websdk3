/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JWT } from '../models/JWT';
import type { RegCompleteRequestBody } from '../models/RegCompleteRequestBody';
import type { RegInit } from '../models/RegInit';
import type { RegInitRequestBody } from '../models/RegInitRequestBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RegService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Complete WebAuthn registration flow
     * @returns JWT OK response.
     * @throws ApiError
     */
    public regRegComplete({
        requestBody,
    }: {
        requestBody: RegCompleteRequestBody,
    }): CancelablePromise<JWT> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/reg/complete',
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
     * @returns RegInit OK response.
     * @throws ApiError
     */
    public regRegInit({
        requestBody,
        userAgent,
    }: {
        requestBody: RegInitRequestBody,
        /**
         * Raw user-agent header as set by a browser
         */
        userAgent?: string,
    }): CancelablePromise<RegInit> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/reg/init',
            headers: {
                'User-Agent': userAgent,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `BadRequest: Bad Request response.`,
                401: `Unauthorized: Unauthorized response.`,
                403: `Forbidden: Forbidden response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
}
