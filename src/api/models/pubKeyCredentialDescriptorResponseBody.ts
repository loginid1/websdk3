/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type pubKeyCredentialDescriptorResponseBody = {
    /**
     * Base64 encoded byte array of the public key identifier.
     */
    id: string;
    transports?: Array<'usb' | 'nfc' | 'ble' | 'internal'>;
    type: 'public-key';
};

