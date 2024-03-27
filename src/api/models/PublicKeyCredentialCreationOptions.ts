/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthenticatorSelectionCriteria } from './AuthenticatorSelectionCriteria';
import type { PubKeyCredentialDescriptor } from './PubKeyCredentialDescriptor';
import type { PublicKeyCredentialParameters } from './PublicKeyCredentialParameters';
import type { PublicKeyCredentialRpEntity } from './PublicKeyCredentialRpEntity';
import type { PublicKeyCredentialUserEntity } from './PublicKeyCredentialUserEntity';
export type PublicKeyCredentialCreationOptions = {
    /**
     * A preference for attestation conveyance.
     */
    attestation?: 'none' | 'indirect' | 'direct' | 'enterprise';
    authenticatorSelection?: AuthenticatorSelectionCriteria;
    /**
     * This base64 encoded byte array represents a challenge that
     * the selected authenticator signs, along with other data, when
     * producing an authentication assertion.
     */
    challenge: string;
    /**
     * List of credentials to limit the creation of multiple credentials for the same
     * account on a single authenticator. The client is requested to return an error
     * if the new credential would be created on an authenticator that also contains
     * one of the credentials enumerated in this parameter.
     */
    excludeCredentials?: Array<PubKeyCredentialDescriptor>;
    /**
     * Additional parameters requesting processing by the client and authenticator.
     */
    extensions?: Record<string, string>;
    /**
     * This member contains information about the desired properties of the credential
     * to be created. The sequence is ordered from most preferred to least preferred.
     * The client makes a best-effort to create the most preferred credential that it
     * can.
     */
    pubKeyCredParams: Array<PublicKeyCredentialParameters>;
    rp: PublicKeyCredentialRpEntity;
    /**
     * This OPTIONAL member specifies a time, in milliseconds,
     * that the caller is willing to wait for the call to complete. The
     * value is treated as a hint, and MAY be overridden by the client.
     */
    timeout?: number;
    user: PublicKeyCredentialUserEntity;
};

