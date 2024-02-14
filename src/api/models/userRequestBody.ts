/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type userRequestBody = {
    /**
     * Display Name
     */
    displayName?: string;
    /**
     * Username
     */
    username: string;
    /**
     * Username type
     */
    usernameType?: userRequestBody.usernameType;
};
export namespace userRequestBody {
    /**
     * Username type
     */
    export enum usernameType {
        EMAIL = 'email',
        PHONE = 'phone',
    }
}

