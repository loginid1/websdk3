// Copyright (C) LoginID

import {
  LoginIDConfig,
  MfaBeginOptions,
  MfaFactorName,
  MfaPerformActionOptions,
  MfaSessionResult,
} from "../types";
import {
  passkeyOptions,
  toMfaInfo,
  toMfaSessionDetails,
} from "../lib/defaults";
import { ApiError, Mfa, MfaBeginRequestBody, MfaNext } from "../../api";
import { WebAuthnHelper } from "../../webauthn/webauthn-helper";
import { CheckoutIdStore } from "../lib/store/checkout-id";
import { LoginIDParamValidator } from "../lib/validators";
import { DeviceStore } from "../lib/store/device-store";
import { TrustStore } from "../lib/store/trust-store";
import { MfaStore } from "../lib/store/mfa-store";
import { defaultDeviceInfo } from "../../browser";
import LoginIDError from "../../errors/loginid";
import LoginIDBase from "../base";

class MFA extends LoginIDBase {
  /**
   * Initializes a new MFA instance with the provided configuration.
   *
   * @param {LoginIDConfig} config Configuration object for LoginID services.
   *
   */
  constructor(config: LoginIDConfig) {
    super(config);
  }

  /**
   * Initiates the pre-authentication process for Multi-Factor Authentication (MFA).
   * This method begins an MFA session and stores session details in local storage.
   *
   * To proceed with the MFA flow, use the `performAction` method with the required
   * payload if necessary. To check the current MFA session status, use `getMfaSessionDetails`.
   *
   * @param {string} username - The username of the user initiating MFA.
   * @param {MfaBeginOptions} [options={}] - Optional parameters for initiating MFA.
   * @returns {Promise<MfaSessionResult>} - A promise resolving to the MFA session result.
   */
  async beginFlow(
    username: string,
    options: MfaBeginOptions = {},
  ): Promise<MfaSessionResult> {
    const appId = this.config.getAppId();
    const deviceId = DeviceStore.getDeviceId(appId);
    const deviceInfo = defaultDeviceInfo(deviceId);
    const opts = passkeyOptions(username, "", options);

    const trustStore = new TrustStore(appId);
    const trustId = await trustStore.setOrSignWithTrustId(username);

    // NOTE: This needs to be clarified
    let walletTrustId = "";
    if (options.txPayload) {
      // NOTE: This needs to be clarified
      const checkoutIdStore = new CheckoutIdStore();
      walletTrustId = await checkoutIdStore.setCheckoutId();
    }

    const mfaBeginRequestBody: MfaBeginRequestBody = {
      deviceInfo: deviceInfo,
      user: {
        username: username,
        usernameType: opts.usernameType,
        displayName: opts.displayName,
      },
      trustItems: {
        ...(trustId && { auth: trustId }),
        ...(walletTrustId && { wallet: walletTrustId }),
        // NOTE: This needs to be clarified
        ...(options.checkoutId && { merchant: options.checkoutId }),
      },
      ...(options.txPayload && { payload: options.txPayload }),
    };

    const mfaNextResult = await this.service.mfa.mfaMfaBegin({
      requestBody: mfaBeginRequestBody,
    });

    const mfaInfo = toMfaInfo(mfaNextResult, username);

    MfaStore.persistInfo(appId, mfaInfo);

    this.session.logout();

    return toMfaSessionDetails(mfaInfo);
  }

  /**
   * Performs a Multi-Factor Authentication (MFA) action using the specified factor.
   *
   * This method supports various MFA factors, including passkeys, OTP (email/SMS), and external authentication.
   * It validates the provided options, processes the authentication step, and invokes the corresponding MFA API.
   * The MFA session deatils is updated upon a successful factor completion.
   *
   * - **OTP Request (email/SMS):** Initiates an OTP request by sending an OTP to the user's contact information. If `options.payload` contains a contact, it will be used; otherwise, the primary contact on record is used.
   * - **OTP Verify (email/SMS):** Verifies the OTP code provided in `options.payload` by validating it against the expected value.
   * - **External authentication:** Provide the authorization code in `options.payload`.
   * - **Passkeys:** Uses WebAuthn for authentication or registration.
   *
   * @param {MfaFactorName} factorName - The MFA factor being performed (e.g., `"passkey"`, `"otp:email"`, `"otp:sms"`, `"external"`).
   * @param {MfaPerformActionOptions} [options={}] - The options containing session and payload data for the MFA factor.
   * @returns {Promise<MfaSessionResult>} - A promise resolving to the updated MFA session result.
   */
  async performAction(
    factorName: MfaFactorName,
    options: MfaPerformActionOptions = {},
  ): Promise<MfaSessionResult> {
    const appId = this.config.getAppId();
    const info = MfaStore.getInfo(appId);
    const { payload, session } = LoginIDParamValidator.mfaOptionValidator(
      factorName,
      info,
      options,
    );

    switch (factorName) {
      case "passkey:reg":
      case "passkey:auth":
      case "passkey:tx": {
        const requestOptions =
          LoginIDParamValidator.validatePasskeyPayload(payload);

        if ("rpId" in requestOptions) {
          const authCompleteRequestBody =
            await WebAuthnHelper.getNavigatorCredential({
              action: "proceed",
              assertionOptions: requestOptions,
              crossAuthMethods: [],
              fallbackMethods: [],
              session: session,
            });

          if (factorName === "passkey:tx") {
            return await this.invokeMfaApi(appId, info?.username, async () => {
              return await this.service.mfa.mfaMfaPasskeyTx({
                authorization: session,
                requestBody: {
                  assertionResult: authCompleteRequestBody.assertionResult,
                },
              });
            });
          }

          return await this.invokeMfaApi(appId, info?.username, async () => {
            return await this.service.mfa.mfaMfaPasskeyAuth({
              authorization: session,
              requestBody: {
                assertionResult: authCompleteRequestBody.assertionResult,
              },
            });
          });
        }

        if ("rp" in requestOptions) {
          const regCompleteRequestBody =
            await WebAuthnHelper.createNavigatorCredential({
              action: "proceed",
              registrationRequestOptions: requestOptions,
              session: session,
            });

          return await this.invokeMfaApi(appId, info?.username, async () => {
            return await this.service.mfa.mfaMfaPasskeyReg({
              authorization: session,
              requestBody: {
                creationResult: regCompleteRequestBody.creationResult,
              },
            });
          });
        }

        break;
      }

      case "otp:email":
      case "otp:sms": {
        const { session: newSession } = await this.service.mfa.mfaMfaOtpRequest(
          {
            authorization: session,
            requestBody: {
              method: factorName === "otp:email" ? "email" : "sms",
              option: payload,
            },
          },
        );

        MfaStore.updateSession(appId, newSession);

        return toMfaSessionDetails(MfaStore.getInfo(appId));
      }

      case "otp:verify": {
        return await this.invokeMfaApi(appId, info?.username, async () => {
          return await this.service.mfa.mfaMfaOtpVerify({
            authorization: session,
            requestBody: {
              otp: payload,
            },
          });
        });
      }

      case "external": {
        return await this.invokeMfaApi(appId, info?.username, async () => {
          return await this.service.mfa.mfaMfaThirdPartyAuthVerify({
            authorization: session,
            requestBody: {
              token: payload,
            },
          });
        });
      }
    }

    throw new LoginIDError(
      `MFA factor ${factorName} is not supported in the current MFA flow.`,
    );
  }

  /**
   * Retrieves the current Multi-Factor Authentication (MFA) session details.
   *
   * This method fetches the latest MFA session information from local storage and
   * includes any available authentication tokens. It provides the current status
   * of the MFA process, including remaining factors and completion state.
   *
   * @returns {MfaSessionResult} - The current MFA session details, including session status and tokens.
   */
  getMfaSessionDetails(): MfaSessionResult {
    const appId = this.config.getAppId();
    const info = MfaStore.getInfo(appId);
    const tokenSet = this.session.getTokenSet();
    return toMfaSessionDetails(info, tokenSet);
  }

  /**
   * Handles the execution of an MFA API request and updates the MFA session state.
   *
   * This internal method executes the provided MFA request function, updates local storage,
   * and sets authentication tokens. If the request results in an MFA challenge (401 error),
   * it processes the response and updates the session accordingly.
   *
   * @param {string} appId - The application ID associated with the MFA session.
   * @param {string} [username=""] - The username, if available.
   * @param {() => Promise<Mfa>} fn - A function that performs the MFA API request.
   * @returns {Promise<MfaSessionResult>} - The updated MFA session result.
   */
  private async invokeMfaApi(
    appId: string,
    username: string = "",
    fn: () => Promise<Mfa>,
  ): Promise<MfaSessionResult> {
    try {
      const mfaSuccessResult = await fn();
      const mfaInfo = MfaStore.getInfo(appId);

      MfaStore.persistInfo(appId, {
        ...(username && { username }),
        flow: mfaInfo?.flow,
        next: [],
      });

      this.session.setTokenSet(mfaSuccessResult);
      DeviceStore.persistDeviceId(appId, mfaSuccessResult.deviceId);

      const newMfaInfo = MfaStore.getInfo(appId);

      return toMfaSessionDetails(newMfaInfo, mfaSuccessResult);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401 && error.body.session) {
          const mfaNextResult = error.body as MfaNext;
          const mfaInfo = toMfaInfo(mfaNextResult, username);

          MfaStore.persistInfo(appId, mfaInfo);

          return toMfaSessionDetails(mfaInfo);
        }
      }

      throw error;
    }
  }
}

export default MFA;
