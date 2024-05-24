/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailAuthInitResponseBody } from '../models/EmailAuthInitResponseBody';
import type { EmailVerifyRequestBody } from '../models/EmailVerifyRequestBody';
import type { JWT } from '../models/JWT';
import type { PhoneAddInitRequestBody } from '../models/PhoneAddInitRequestBody';
import type { PhoneAuthInitRequestBody } from '../models/PhoneAuthInitRequestBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PhoneService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Send SMS to add phone number to profile
     * @returns EmailAuthInitResponseBody OK response.
     * @throws ApiError
     */
    public phonePhoneAddInit({
        requestBody,
    }: {
        requestBody: PhoneAddInitRequestBody,
    }): CancelablePromise<EmailAuthInitResponseBody> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/phone/add/init',
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
     * Send SMS to authenticate into account
     * @returns EmailAuthInitResponseBody OK response.
     * @throws ApiError
     */
    public phonePhoneAuthInit({
        requestBody,
    }: {
        requestBody: PhoneAuthInitRequestBody,
    }): CancelablePromise<EmailAuthInitResponseBody> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/phone/auth/init',
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
     * Verify SMS OTP
     * @returns JWT OK response.
     * @throws ApiError
     */
    public phonePhoneVerify({
        requestBody,
    }: {
        requestBody: EmailVerifyRequestBody,
    }): CancelablePromise<JWT> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/phone/verify',
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
