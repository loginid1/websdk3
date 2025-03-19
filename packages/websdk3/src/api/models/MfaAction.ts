/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { MfaOption } from './MfaOption';
/**
 * Next Action to be performed.
 */
export type MfaAction = {
    action: {
        /**
         * Action description
         */
        desc?: string;
        /**
         * Human readable action label
         */
        label: string;
        /**
         * Next Action to be performed.
         */
        name: 'passkey' | 'otp:email' | 'otp:sms' | 'external';
    };
    /**
     * Additional options associated with the action.
     */
    options?: Array<MfaOption>;
};

