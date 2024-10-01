/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PublicKeyCredential = {
    /**
     * This base64 encoded byte array contains the credential ID
     * of the public key credential the caller is referring to.
     */
    id: string;
    /**
     * This enumeration defines hints as to how clients might communicate with a
     * particular authenticator in order to obtain an assertion for a specific
     * credential.
     */
    transport?: 'usb' | 'nfc' | 'ble' | 'internal' | 'hybrid' | 'cable' | 'smart-card';
    /**
     * The type of the public key credential the caller is referring to.
     * The value SHOULD be a member of PublicKeyCredentialType but client
     * platforms MUST ignore any PublicKeyCredentialDescriptor with an unknown
     * type.
     */
    type?: 'public-key';
};

