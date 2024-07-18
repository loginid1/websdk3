// Copyright (C) LoginID
import LoginIDBase from '../base'
import AbortControllerManager from '../../abort-controller'
import { passkeyOptions } from '../lib/defaults'
import { AuthCodeRequestSMSRequestBody, AuthCodeVerifyRequestBody } from '../../api'
import {
  AuthenticateWithPasskeysOptions,
  LoginIDConfig,
  Message,
  PasskeyResult,
  SendCodeOptions,
} from '../types'

/**
 * Extends LoginIDBase to support OTP codes.
 */
class Code extends LoginIDBase {
  /**
   * Initializes a new instance of Code with the provided configuration.
   * @param {LoginIDConfig} config Configuration object for LoginID.
   */
  constructor(config: LoginIDConfig) {
    super(config)
  }

  /**
   * Authenticate with a code.
   * @param {string} username Username to authenticate.
   * @param {string} code code to authenticate.
   * @param {AuthenticateWithPasskeysOptions} options Additional authentication options.
   * @returns {Promise<PasskeyResult>} Result of the authentication operation.
   */
  async authenticateWithCode(username: string, code: string, options: AuthenticateWithPasskeysOptions = {}): Promise<PasskeyResult> {
    const opts = passkeyOptions(username, options)
    const request: AuthCodeVerifyRequestBody = {
      authCode: code,
      user: {
        username: username,
        usernameType: opts.usernameType,
      },
    }
  
    const result = await this.service
      .auth.authAuthCodeVerify({
        requestBody: request
      })

    // Renew abort controller since authentication is complete
    AbortControllerManager.renewWebAuthnAbortController()

    this.session.setJwtCookie(result.jwtAccess)

    return result
  }

  /**
   * Send a code to the user via the specified method.
   * @param {string} username Username to send the code to.
   * @param {Message} method Method to send the code, either 'email' or 'sms'. Default is 'email'.
   * @param {SendCodeOptions} options Additional options for sending the code.
   * @returns {Promise<null>} A promise that resolves to null upon successful completion.
   */
  async sendCode(username: string, method: Message = 'email', options: SendCodeOptions = {}): Promise<null> {
    const opts = passkeyOptions(username, options)
    const request: AuthCodeRequestSMSRequestBody = {
      user: {
        username: username,
        usernameType: opts.usernameType,
      }
    }

    switch (method) {
    case 'email':
      await this.service.auth.authAuthCodeRequestEmail({ 
        requestBody: request
      })
      break

    case 'sms':
      await this.service.auth.authAuthCodeRequestSms({ 
        requestBody: request
      })
      break

    default:
      throw new Error('Invalid message method')
    }

    return null
  }
}

export default Code
