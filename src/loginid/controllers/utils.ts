import LoginIDBase from '../base'
import { passkeyOptions } from '../lib/defaults'
import { defaultDeviceInfo } from '../../browser'
import { ApiError, AuthInitRequestBody } from '../../api/'
import { LoginIDConfig, VerifyConfigResult } from '../types'

class Utils extends LoginIDBase{
  /**
   * Initializes a new Utils instance with the provided configuration.
   * @param {LoginIDConfig} config Configuration object for LoginID.
   */
  constructor(config: LoginIDConfig) {
    super(config)
  }

  /**
   * Verifies the configuration settings of the application.
   * @returns {Promise<VerifyConfigResult>} The result of the verification process.
   */
  public async verifyConfigSettings(): Promise<VerifyConfigResult> {
    const result: VerifyConfigResult = {
      isValid: true,
    }

    try {
      this.config.getAppId()
    } catch (error) {
      result.isValid = false
      result.solution = 'Please verify that your base URL is correct.'
      result.code = 'invalid_app_id'
      result.message = 'Invalid app ID'
      return result
    }

    try {
      const opts = passkeyOptions('', {})
      const requestBody: AuthInitRequestBody = {
        app: {
          id: this.config.getAppId(),
        },
        deviceInfo: defaultDeviceInfo(),
        user: {
          username: '',
          usernameType: opts.usernameType,
        },
      }

      await this.service.auth.authAuthInit({ requestBody })
    } catch (error) {
      result.isValid = false
      result.solution = 'Verify that your application exists and the base URL is correct.'
      result.code = 'unknown_error'
      result.message = 'Unknown error.'

      if (error instanceof ApiError) {
        result.code = error.body.msgCode || 'unknown_error'
        result.message = error.body.msg || error.body.message || 'Unknown error.'
      }

      return result
    }

    return result
  }

  /**
   * Retrieves the currently authenticated user's information.
   * @returns {LoginIDUser} The currently authenticated user's information, including username and id.
   * @throws {Error} If the user is not logged in, throws USER_NO_OP_ERROR.
   */
  public getUser() {
    return this.session.getUser()
  }

  /**
   * checks if the user is logged in.
   * @returns {boolean}
   */
  public isLoggedIn() {
    return this.session.isLoggedIn()
  }

  /**
   * deletes the jwt cookie.
   * @returns {boolean}
   */
  public signout() {
    this.session.signout()
  }
}

export default Utils
