/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileEmailUpdateRequestBody } from '../models/ProfileEmailUpdateRequestBody';
import type { ProfilePhoneUpdateRequestBody } from '../models/ProfilePhoneUpdateRequestBody';
import type { ProfilePhoneVerifyRequestBody } from '../models/ProfilePhoneVerifyRequestBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProfileService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Delete a user profile and all associated passkey
     * @returns void
     * @throws ApiError
     */
    public profileProfileDelete({
        id,
    }: {
        /**
         * Internal user identifier
         */
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/fido2/v2/profile/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `NotFound: Not Found response.`,
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
    /**
     * Update profile email address
     * @returns void
     * @throws ApiError
     */
    public profileProfileEmailUpdate({
        id,
        requestBody,
    }: {
        /**
         * Internal user identifier
         */
        id: string,
        requestBody: ProfileEmailUpdateRequestBody,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/profile/{id}/email',
            path: {
                'id': id,
            },
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
     * Delete phone from the profile
     * @returns void
     * @throws ApiError
     */
    public profileProfilePhoneDelete({
        id,
    }: {
        /**
         * Internal user identifier
         */
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/fido2/v2/profile/{id}/phone',
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
    /**
     * Update the profile phone number
     * @returns void
     * @throws ApiError
     */
    public profileProfilePhoneUpdate({
        id,
        requestBody,
    }: {
        /**
         * Internal user identifier
         */
        id: string,
        requestBody: ProfilePhoneUpdateRequestBody,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/profile/{id}/phone',
            path: {
                'id': id,
            },
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
     * Verify phone number with received authorization code
     * @returns void
     * @throws ApiError
     */
    public profileProfileEmailVerify({
        requestBody,
    }: {
        requestBody: ProfilePhoneVerifyRequestBody,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/profile/email/verify',
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
     * Verify phone number with received authorization code
     * @returns void
     * @throws ApiError
     */
    public profileProfilePhoneVerify({
        requestBody,
    }: {
        requestBody: ProfilePhoneVerifyRequestBody,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/profile/phone/verify',
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
