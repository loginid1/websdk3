/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Version3 } from '../models/Version3';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class VersionService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Show software version
     * @returns Version3 OK response.
     * @throws ApiError
     */
    public versionVersionShow(): CancelablePromise<Version3> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/fido2/v2/version',
        });
    }
}
