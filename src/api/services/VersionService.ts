/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VersionVersionShowResponseBody } from '../models/VersionVersionShowResponseBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class VersionService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Show software version
     * @returns VersionVersionShowResponseBody OK response.
     * @throws ApiError
     */
    public versionVersionShow(): CancelablePromise<VersionVersionShowResponseBody> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/version',
        });
    }
}
