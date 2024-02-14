/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Additional parameters when creating a new credential.
 */
export type publicKeyCredentialParametersResponseBody = {
    /**
     * A cryptographic signature algorithm with which the newly generated credential
     * will be used, and thus also the type of asymmetric key pair to be generated,
     * e.g., RSA or Elliptic Curve.
     */
    alg?: publicKeyCredentialParametersResponseBody.alg;
    type?: publicKeyCredentialParametersResponseBody.type;
};
export namespace publicKeyCredentialParametersResponseBody {
    /**
     * A cryptographic signature algorithm with which the newly generated credential
     * will be used, and thus also the type of asymmetric key pair to be generated,
     * e.g., RSA or Elliptic Curve.
     */
    export enum alg {
        '_-7' = -7,
        '_-35' = -35,
        '_-36' = -36,
        '_-257' = -257,
        '_-8' = -8,
    }
    export enum type {
        PUBLIC_KEY = 'public-key',
    }
}

