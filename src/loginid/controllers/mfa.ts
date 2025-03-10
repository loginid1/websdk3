import LoginIDError from '../../errors/loginid'
import { defaultDeviceInfo } from '../../browser'
import { MfaStore } from '../lib/store/mfa-store'
import { DeviceStore } from '../lib/store/device-store'
import { LoginIDParamValidator } from '../lib/validators'
import { WebAuthnHelper } from '../../webauthn/webauthn-helper'
import { ApiError, Mfa, MfaBeginRequestBody, MfaNext } from '../../api'
import { passkeyOptions, toMfaInfo, toMfaSessionDetails } from '../lib/defaults'
import {
  LoginIDConfig,
  MfaBeginOptions,
  MfaFactorName,
  MfaOtpFactorName,
  MfaPerformFactorOptions,
  MfaRequestFactorOptions,
  MfaSessionResult
} from '../types'
import LoginIDBase from '../base'
import { TrustStore } from '../lib/store/trust-store'

class MFA extends LoginIDBase {
  /**
   * Initializes a new MFA instance with the provided configuration.
   * 
   * @param {LoginIDConfig} config Configuration object for LoginID services.
   * 
   */
  constructor(config: LoginIDConfig) {
    super(config)
  }

  /**
   * Initiates the pre-authentication process for Multi-Factor Authentication (MFA).
   * This method begins an MFA session and stores session details in local storage.
   * 
   * To proceed with the MFA flow, use the `performFactor` method with the required 
   * payload if necessary. To check the current MFA session status, use `getMfaSessionDetails`.
   *
   * @param {string} username - The username of the user initiating MFA.
   * @param {MfaBeginOptions} [options={}] - Optional parameters for initiating MFA.
   * @returns {Promise<MfaSessionResult>} - A promise resolving to the MFA session result.
   */
  async beginPreAuth(username: string, options: MfaBeginOptions = {}): Promise<MfaSessionResult> {
    const appId = this.config.getAppId()
    const deviceId = DeviceStore.getDeviceId(appId)
    const deviceInfo = defaultDeviceInfo(deviceId)
    const opts = passkeyOptions(username, '', options)

    const trustStore = new TrustStore(appId)
    const trustInfo = await trustStore.setOrSignWithTrustId(username)

    const mfaBeginRequestBody: MfaBeginRequestBody = {
      deviceInfo: deviceInfo,
      user: {
        username: username,
        usernameType: opts.usernameType,
        displayName: opts.displayName,
      },
      trustInfo: trustInfo,
    }

    const mfaNextResult = await this.service.mfa.mfaMfaBegin({
      userAgent: '',
      requestBody: mfaBeginRequestBody
    })

    const mfaInfo = toMfaInfo(mfaNextResult, username)

    MfaStore.persistInfo(appId, mfaInfo)

    this.session.logout()

    return toMfaSessionDetails(mfaInfo)
  }

  /**
   * Performs a Multi-Factor Authentication (MFA) action using the specified factor.
   * 
   * This method supports various MFA factors, including passkeys, OTP (email/SMS), and external authentication.
   * It validates the provided options, processes the authentication step, and invokes the corresponding MFA API.
   * The MFA session deatils is updated upon a successful factor completion.
   *
   * - **OTP (email/SMS):** Provide the OTP code in `options.payload`.
   * - **External authentication:** Provide the authorization code in `options.payload`.
   * - **Passkeys:** Uses WebAuthn for authentication or registration.
   * 
   * @param {MfaFactorName} factorName - The MFA factor being performed (e.g., `"passkey"`, `"otp:email"`, `"otp:sms"`, `"external"`).
   * @param {MfaPerformFactorOptions} [options={}] - The options containing session and payload data for the MFA factor.
   * @returns {Promise<MfaSessionResult>} - A promise resolving to the updated MFA session result.
   */
  async performFactor(
    factorName: MfaFactorName,
    options: MfaPerformFactorOptions = {}
  ): Promise<MfaSessionResult> {
    const appId = this.config.getAppId()
    const info = MfaStore.getInfo(appId)
    const { payload, session } = LoginIDParamValidator.mfaOptionValidator(factorName, info, options)

    switch (factorName) {
    case 'passkey': {
      const requestOptions = LoginIDParamValidator.validatePasskeyPayload(payload)

      if ('rpId' in requestOptions) {
        const authCompleteRequestBody = await WebAuthnHelper.getNavigatorCredential({
          action: 'proceed',
          assertionOptions: requestOptions,
          crossAuthMethods: [],
          fallbackMethods: [],
          session: session,
        })

        return await this.invokeMfaApi(appId, info?.username, async () => {
          return await this.service.mfa.mfaMfaPasskeyAuth({
            authorization: session,
            requestBody: {
              assertionResult: authCompleteRequestBody.assertionResult,
            }
          })
        })
      }

      if ('rp' in requestOptions) {
        const regCompleteRequestBody = await WebAuthnHelper.createNavigatorCredential({
          action: 'proceed',
          registrationRequestOptions: requestOptions,
          session: session,
        })

        return await this.invokeMfaApi(appId, info?.username, async () => {
          return await this.service.mfa.mfaMfaPasskeyReg({
            authorization: session,
            requestBody: {
              creationResult: regCompleteRequestBody.creationResult,
            }
          })
        })
      }

      break
    }
      
    case 'otp:email':
    case 'otp:sms': {
      return await this.invokeMfaApi(appId, info?.username, async () => {
        return await this.service.mfa.mfaMfaOtpVerify({
          authorization: session,
          requestBody: {
            otp: payload,
          }
        })
      })
    }

    case 'external': {
      return await this.invokeMfaApi(appId, info?.username, async () => {
        return await this.service.mfa.mfaMfaThirdPartyAuthVerify({
          authorization: session,
          requestBody: {
            token: payload,
          }
        })
      })
    }
    }

    throw new LoginIDError(`MFA factor ${factorName} is not supported in the current MFA flow.`)
  }

  /**
   * Requests a new OTP (One-Time Password) for Multi-Factor Authentication (MFA).
   * 
   * This method is used to initiate an OTP request via email or SMS. 
   * The MFA session is updated upon a successful request.
   * 
   * - **OTP (email):** Requests an OTP via email.
   * - **OTP (SMS):** Requests an OTP via SMS.
   * 
   * @param {MfaOtpFactorName} factorName - The OTP factor being requested (`"otp:email"` or `"otp:sms"`).
   * @param {MfaRequestFactorOptions} [options={}] - The options containing session and payload data.
   * @returns {Promise<MfaSessionResult>} - A promise resolving to the updated MFA session result.
   */
  async requestFactor(
    factorName: MfaOtpFactorName,
    options: MfaRequestFactorOptions = {}
  ): Promise<MfaSessionResult> {
    LoginIDParamValidator.checkValidMfaOtpFactorName(factorName)

    const appId = this.config.getAppId()
    const info = MfaStore.getInfo(appId)
    const { payload, session } = LoginIDParamValidator.mfaOptionValidator(factorName, info, options)

    const { session: newSession } = await this.service.mfa.mfaMfaOtpRequest({
      authorization: session,
      requestBody: {
        method: factorName === 'otp:email' ? 'email' : 'sms',
        option: payload,
      }
    })

    MfaStore.updateSession(appId, newSession)

    return toMfaSessionDetails(MfaStore.getInfo(appId))
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
    const appId = this.config.getAppId()
    const info = MfaStore.getInfo(appId)
    const tokenSet = this.session.getTokenSet()
    return toMfaSessionDetails(info, tokenSet)
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
    username: string = '',
    fn: () => Promise<Mfa>
  ): Promise<MfaSessionResult> {
    try {
      const mfaSuccessResult = await fn()
      const mfaInfo = MfaStore.getInfo(appId)

      MfaStore.persistInfo(appId, {
        ...username && { username },
        flow: mfaInfo?.flow,
        next: [],
      })

      this.session.setTokenSet(mfaSuccessResult)

      const newMfaInfo = MfaStore.getInfo(appId)
      const tokenSet = this.session.getTokenSet()

      return toMfaSessionDetails(newMfaInfo, tokenSet)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          const mfaNextResult = error.body as MfaNext
          const mfaInfo = toMfaInfo(mfaNextResult, username)

          MfaStore.persistInfo(appId, mfaInfo)

          return toMfaSessionDetails(mfaInfo)
        }
      }

      throw error
    }
  }
}

export default MFA
