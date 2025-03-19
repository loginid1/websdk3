/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
export type MfaOtpRequestRequestBody = {
    /**
     * OTP method
     */
    method: 'email' | 'sms';
    /**
     * An OTP option selected by the user (i.e. address to send the OTP request to - phone, email, etc.)
     */
    option?: string;
};

