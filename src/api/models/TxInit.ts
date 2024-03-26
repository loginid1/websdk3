/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublicKeyCredentialRequestOptions } from './PublicKeyCredentialRequestOptions';
export type TxInit = {
    assertionOptions: PublicKeyCredentialRequestOptions;
    /**
     * An opaque object containing session data.
     */
    session: string;
    /**
     * Internal transaction identifier
     */
    txId: string;
};

