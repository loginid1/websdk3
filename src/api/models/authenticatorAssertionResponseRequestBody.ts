/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type authenticatorAssertionResponseRequestBody = {
    /**
     * This attribute contains the authenticator data returned by the authenticator.
     */
    authenticatorData?: string;
    /**
     * Base64 encoded byte array which is a JSON-compatible serialization of client data
     * passed to the authenticator by the client in order to generate this assertion.
     * The exact JSON serialization MUST be preserved, as the hash of the serialized
     * client data has been computed over it.
     */
    clientDataJSON?: string;
    /**
     * A base64 encoded byte sequence identifying a public key credential
     * source and its authentication assertions.
     */
    credentialId?: string;
    /**
     * Base64 encoded the raw signature returned from the authenticator.
     */
    signature?: string;
    /**
     * User handle returned from the authenticator, or null if the authenticator did not return a user handle.
     */
    userHandle?: string;
};

