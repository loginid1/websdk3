/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailAddInitRequestBody } from '../models/EmailAddInitRequestBody';
import type { EmailAuthInitRequestBody } from '../models/EmailAuthInitRequestBody';
import type { EmailAuthInitResponseBody } from '../models/EmailAuthInitResponseBody';
import type { EmailVerifyRequestBody } from '../models/EmailVerifyRequestBody';
import type { JWT } from '../models/JWT';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class EmailService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Send email to add email number to profile
     * @returns EmailAuthInitResponseBody OK response.
     * @throws ApiError
     */
    public emailEmailAddInit({
        requestBody,
    }: {
        requestBody: EmailAddInitRequestBody,
    }): CancelablePromise<EmailAuthInitResponseBody> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/email/add/init',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `BadRequest: Bad Request response.`,
                401: `Unauthorized: Unauthorized response.`,
                404: `NotFound: Not Found response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
    /**
     * Send email to authenticate into account
     * @returns EmailAuthInitResponseBody OK response.
     * @throws ApiError
     */
    public emailEmailAuthInit({
        requestBody,
    }: {
        requestBody: EmailAuthInitRequestBody,
    }): CancelablePromise<EmailAuthInitResponseBody> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/email/auth/init',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `BadRequest: Bad Request response.`,
                404: `NotFound: Not Found response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
    /**
     * Verify Email OTP
     * @returns JWT OK response.
     * @throws ApiError
     */
    public emailEmailVerify({
        requestBody,
    }: {
        requestBody: EmailVerifyRequestBody,
    }): CancelablePromise<JWT> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/email/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `BadRequest: Bad Request response.`,
                404: `NotFound: Not Found response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
}
