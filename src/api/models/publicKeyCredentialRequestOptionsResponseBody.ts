/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { pubKeyCredentialDescriptorResponseBody } from './pubKeyCredentialDescriptorResponseBody';
export type publicKeyCredentialRequestOptionsResponseBody = {
    /**
     * A list of PublicKeyCredentialDescriptor objects representing public key
     * credentials acceptable to the caller, in descending order of the caller’s
     * preference (the first item in the list is the most preferred credential,
     * and so on down the list).
     */
    allowCredentials?: Array<pubKeyCredentialDescriptorResponseBody>;
    /**
     * This base64 encoded byte array represents a challenge that the selected
     * authenticator signs, along with other data, when producing an authentication
     * assertion.
     */
    challenge: string;
    /**
     * Additional parameters requesting additional processing by the client and
     * authenticator. For example, if transaction confirmation is sought from the
     * user, then the prompt string might be included as an extension.
     */
    extensions?: Record<string, string>;
    /**
     * The relying party identifier claimed by the caller. If omitted, its value will
     * be the CredentialsContainer object’s relevant settings object's origin's
     * effective domain.
     */
    rpId?: string;
    /**
     * Specifies a time, in milliseconds, that the caller is willing
     * to wait for the call to complete. The value is treated as a
     * hint, and MAY be overridden by the client.
     */
    timeout?: number;
    /**
     * The Relying Party's requirements regarding user verification for the get()
     * operation. The value SHOULD be a member of UserVerificationRequirement but
     * client platforms MUST ignore unknown values, treating an unknown value as if
     * the member does not exist. Eligible authenticators are filtered to only those
     * capable of satisfying this requirement.
     */
    userVerification?: publicKeyCredentialRequestOptionsResponseBody.userVerification;
};
export namespace publicKeyCredentialRequestOptionsResponseBody {
    /**
     * The Relying Party's requirements regarding user verification for the get()
     * operation. The value SHOULD be a member of UserVerificationRequirement but
     * client platforms MUST ignore unknown values, treating an unknown value as if
     * the member does not exist. Eligible authenticators are filtered to only those
     * capable of satisfying this requirement.
     */
    export enum userVerification {
        REQUIRED = 'required',
        PREFERRED = 'preferred',
        DISCOURAGED = 'discouraged',
    }
}

