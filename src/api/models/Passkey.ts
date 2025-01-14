/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Passkey = {
    /**
     * Timestamp in RFC3339 format.
     */
    createdAt: string;
    /**
     * Credential available on multiple devices
     */
    credentialSynced?: boolean;
    /**
     * Device type
     */
    device: string;
    /**
     * PassKey ID
     */
    id: string;
    /**
     * Name of the passkey
     */
    name: string;
};

