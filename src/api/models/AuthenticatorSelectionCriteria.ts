/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuthenticatorSelectionCriteria = {
    /**
     * Authenticator attachment modality
     */
    authenticatorAttachment?: 'platform' | 'cross-platform';
    /**
     * Resident key requirement
     */
    requireResidentKey?: boolean;
    /**
     * Resident key requirement
     */
    residentKey?: 'discouraged' | 'preferred' | 'required';
    /**
     * Resident key requirement
     */
    userVerification?: 'required' | 'preferred' | 'discouraged';
};

