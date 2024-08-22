/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Information about the device. All of these attributes are optional and should
 * be provided on best effort basis. If provide, they will be taken into
 * consideration in order to improve user experience.
 */
export type DeviceInfo = {
    /**
     * Client name
     */
    clientName: string;
    /**
     * Client type.
     */
    clientType: 'browser' | 'other';
    /**
     * Client version
     */
    clientVersion: string;
    /**
     * An unique device identifier
     */
    deviceId?: string;
    /**
     * OS architecture
     */
    osArch: string;
    /**
     * OS name
     */
    osName: string;
    /**
     * OS version
     */
    osVersion: string;
    /**
     * Screen height in pixels
     */
    screenHeight: number;
    /**
     * Screen width in pixels
     */
    screenWidth: number;
};

