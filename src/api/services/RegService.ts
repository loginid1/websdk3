/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RegRegCompleteRequestBody } from '../models/RegRegCompleteRequestBody';
import type { RegRegCompleteResponseBody } from '../models/RegRegCompleteResponseBody';
import type { RegRegInitRequestBody } from '../models/RegRegInitRequestBody';
import type { RegRegInitResponseBody } from '../models/RegRegInitResponseBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RegService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Complete WebAuthn registration flow
     * @returns RegRegCompleteResponseBody OK response.
     * @throws ApiError
     */
    public regRegComplete({
        regCompleteRequestBody,
    }: {
        regCompleteRequestBody: RegRegCompleteRequestBody,
    }): CancelablePromise<RegRegCompleteResponseBody> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/reg/complete',
            body: regCompleteRequestBody,
            errors: {
                400: `Bad Request response.`,
                403: `Forbidden response.`,
                500: `Internal Server Error response.`,
            },
        });
    }
    /**
     * Start WebAuthn registration flow
     * @returns RegRegInitResponseBody OK response.
     * @throws ApiError
     */
    public regRegInit({
        regInitRequestBody,
        userAgent,
    }: {
        regInitRequestBody: RegRegInitRequestBody,
        /**
         * Raw user-agent header as set by a browser
         */
        userAgent?: string,
    }): CancelablePromise<RegRegInitResponseBody> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/reg/init',
            headers: {
                'User-Agent': userAgent,
            },
            body: regInitRequestBody,
            errors: {
                400: `Bad Request response.`,
                403: `Forbidden response.`,
                500: `Internal Server Error response.`,
            },
        });
    }
}
