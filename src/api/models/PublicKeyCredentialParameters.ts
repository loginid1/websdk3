/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Additional parameters when creating a new credential.
 */
export type PublicKeyCredentialParameters = {
    /**
     * A cryptographic signature algorithm with which the newly generated credential
     * will be used, and thus also the type of asymmetric key pair to be generated,
     * e.g., RSA or Elliptic Curve.
     */
    alg?: -7 | -35 | -36 | -257 | -8;
    type?: 'public-key';
};

