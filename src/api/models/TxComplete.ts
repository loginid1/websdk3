/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Passkey } from './Passkey';
/**
 * Transaction Confirmation Complete response
 */
export type TxComplete = {
    authCred?: Passkey;
    /**
     * Internal passkey identifier
     */
    credentialId: string;
    /**
     * Authorization token
     */
    token: string;
};

