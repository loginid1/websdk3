/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WellKnownJwks } from '../models/WellKnownJwks';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class WellKnownService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * JWKS for auth token validation
     * @returns WellKnownJwks OK response.
     * @throws ApiError
     */
    public wellKnownJwks(): CancelablePromise<WellKnownJwks> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/fido2/v2/.well-known/jwks.json',
            errors: {
                500: `InternalServerError: Internal Server Error response.`,
            },
        });
    }
}
