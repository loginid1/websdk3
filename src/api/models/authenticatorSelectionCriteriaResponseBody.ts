/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type authenticatorSelectionCriteriaResponseBody = {
    /**
     * Authenticator attachment modality
     */
    authenticatorAttachment?: authenticatorSelectionCriteriaResponseBody.authenticatorAttachment;
    /**
     * Resident key requirement
     */
    requireResidentKey?: boolean;
    /**
     * Resident key requirement
     */
    residentKey?: authenticatorSelectionCriteriaResponseBody.residentKey;
    /**
     * Resident key requirement
     */
    userVerification?: authenticatorSelectionCriteriaResponseBody.userVerification;
};
export namespace authenticatorSelectionCriteriaResponseBody {
    /**
     * Authenticator attachment modality
     */
    export enum authenticatorAttachment {
        PLATFORM = 'platform',
        CROSS_PLATFORM = 'cross-platform',
    }
    /**
     * Resident key requirement
     */
    export enum residentKey {
        DISCOURAGED = 'discouraged',
        PREFERRED = 'preferred',
        REQUIRED = 'required',
    }
    /**
     * Resident key requirement
     */
    export enum userVerification {
        REQUIRED = 'required',
        PREFERRED = 'preferred',
        DISCOURAGED = 'discouraged',
    }
}

