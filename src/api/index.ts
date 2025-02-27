/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { LoginIDService } from './LoginIDService';

export { ApiError } from './core/ApiError';
export { BaseHttpRequest } from './core/BaseHttpRequest';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { Aaguid } from './models/Aaguid';
export type { Application } from './models/Application';
export type { AuthCode } from './models/AuthCode';
export type { AuthCodeRequestSMSRequestBody } from './models/AuthCodeRequestSMSRequestBody';
export type { AuthCodeVerifyRequestBody } from './models/AuthCodeVerifyRequestBody';
export type { AuthCompleteRequestBody } from './models/AuthCompleteRequestBody';
export type { AuthenticatorAssertionResponse } from './models/AuthenticatorAssertionResponse';
export type { AuthenticatorSelectionCriteria } from './models/AuthenticatorSelectionCriteria';
export type { AuthInit } from './models/AuthInit';
export type { AuthInitRequestBody } from './models/AuthInitRequestBody';
export type { BadRequestError } from './models/BadRequestError';
export type { CreationResult } from './models/CreationResult';
export type { DeviceInfo } from './models/DeviceInfo';
export type { ForbiddenError } from './models/ForbiddenError';
export type { InternalServerError } from './models/InternalServerError';
export type { JWT } from './models/JWT';
export type { NotFoundError } from './models/NotFoundError';
export type { Passkey } from './models/Passkey';
export type { PasskeyCollection } from './models/PasskeyCollection';
export type { PasskeyOptions } from './models/PasskeyOptions';
export type { PasskeyRenameRequestBody } from './models/PasskeyRenameRequestBody';
export type { PubKeyCredentialDescriptor } from './models/PubKeyCredentialDescriptor';
export type { PublicKeyCredentialCreationOptions } from './models/PublicKeyCredentialCreationOptions';
export type { PublicKeyCredentialParameters } from './models/PublicKeyCredentialParameters';
export type { PublicKeyCredentialRequestOptions } from './models/PublicKeyCredentialRequestOptions';
export type { PublicKeyCredentialRpEntity } from './models/PublicKeyCredentialRpEntity';
export type { PublicKeyCredentialUserEntity } from './models/PublicKeyCredentialUserEntity';
export type { RegCompleteRequestBody } from './models/RegCompleteRequestBody';
export type { RegInit } from './models/RegInit';
export type { RegInitRequestBody } from './models/RegInitRequestBody';
export type { TxComplete } from './models/TxComplete';
export type { TxCompleteRequestBody } from './models/TxCompleteRequestBody';
export type { TxInit } from './models/TxInit';
export type { TxInitRequestBody } from './models/TxInitRequestBody';
export type { UnauthorizedError } from './models/UnauthorizedError';
export type { User } from './models/User';
export type { UserLogin } from './models/UserLogin';

export { AuthService } from './services/AuthService';
export { PasskeysService } from './services/PasskeysService';
export { RegService } from './services/RegService';
export { TxService } from './services/TxService';
