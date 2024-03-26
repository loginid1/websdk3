/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TokenVerifyRequestBody } from '../models/TokenVerifyRequestBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TokenService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Validate JWT Access Token
     * @returns void
     * @throws ApiError
     */
    public tokenTokenVerify({
        requestBody,
    }: {
        requestBody: TokenVerifyRequestBody,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/token/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `BadRequest: Bad Request response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
}
