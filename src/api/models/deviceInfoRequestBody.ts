/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Information about the device. All of these attributes are optional and should
 * be provided on best effort basis. If provide, they will be taken into
 * consideration in order to improve user experience.
 */
export type deviceInfoRequestBody = {
    /**
     * Client name
     */
    clientName?: string;
    /**
     * Client type.
     */
    clientType?: deviceInfoRequestBody.clientType;
    /**
     * Client version
     */
    clientVersion?: string;
    /**
     * An unique device identifier
     */
    deviceId?: string;
    /**
     * OS architecture
     */
    osArch?: string;
    /**
     * OS name
     */
    osName?: string;
    /**
     * OS version
     */
    osVersion?: string;
};
export namespace deviceInfoRequestBody {
    /**
     * Client type.
     */
    export enum clientType {
        BROWSER = 'browser',
        OTHER = 'other',
    }
}

