/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfilePhoneUpdateRequestBody = {
    /**
     * Whether the user consents to receiving SMS messages on this number. The phone
     * will not be used for sending messages if no consent is provided.
     */
    messagingConsent?: boolean;
    /**
     * Phone number
     */
    phoneNumber: string;
    /**
     * Whether to update the phone number immediately or send an authorization code
     * to verify. This method will fail if verification is requested but no consent
     * is provided.
     */
    requestVerification?: boolean;
};

