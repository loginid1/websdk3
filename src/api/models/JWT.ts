/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CodeResult } from './CodeResult';
export type JWT = {
    code?: CodeResult;
    /**
     * JWT access token
     */
    jwtAccess: string;
    deviceID?: string;
};

