/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { UserLogin } from './UserLogin';
export type AuthCodeVerifyRequestBody = {
    /**
     * Authentication code
     */
    authCode: string;
    user: UserLogin;
};

