/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CodeGenerate } from '../models/CodeGenerate';
import type { GenerateCodeRequestBody } from '../models/GenerateCodeRequestBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CodeService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Generate a short code
     * Generate a code for temporary access or adding a new device
     * @returns CodeGenerate OK response.
     * @throws ApiError
     */
    public codeGenerateCode({
        requestBody,
    }: {
        requestBody: GenerateCodeRequestBody,
    }): CancelablePromise<CodeGenerate> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fido2/v2/code',
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
