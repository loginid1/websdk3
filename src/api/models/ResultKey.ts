/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * JWK
 */
export type ResultKey = {
    /**
     * Algorithm used
     */
    alg: string;
    /**
     * Curve used
     */
    crv?: string;
    /**
     * Key operations
     */
    key_ops: Array<string>;
    /**
     * Key Identifier
     */
    kid: string;
    /**
     * Key Type
     */
    kty: string;
    /**
     * Intended use of the key
     */
    use: string;
    /**
     * X coordinate of the elliptic curve public key
     */
    'x'?: string;
    /**
     * Y coordinate of the elliptic curve public key
     */
    'y'?: string;
};

