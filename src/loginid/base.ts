import {LoginIDService} from '../api/LoginIDService'
import { deleteCookie, getCookie, parseJwt, setCookie } from '../utils'
import type {LoginIDConfig, PasskeyOptions} from './types'

/**
 * Provides a base class for integrating with the LoginID API services.
 * This class initializes the common configuration and service needed for derived classes to interact with LoginID services.
 */
class LoginIDBase {
  /**
   * Holds the configuration settings for the LoginID integration, including API base URL.
   */
  protected readonly config: LoginIDConfig

  /**
   * Instance of LoginIDService, providing access to the LoginID API methods.
   */
  protected readonly service: LoginIDService

  /**
   * Constructs a new instance of the LoginIDBase class, initializing the service with the provided configuration.
   * @param {LoginIDConfig} config Configuration object for LoginID API, including the base URL.
   */
  constructor(config: LoginIDConfig) {
    this.config = config
    // Initialize the LoginIDService with the base URL provided in the configuration.
    this.service = new LoginIDService({BASE: config.baseUrl})
  }

  getToken(options: PasskeyOptions): string {
    if (options.token) {
      return options.token
    } else {
      const token = this.getJwtCookie()
      if (token) {
        return token
      } else {
        throw new Error('token is empty')
      }
    }
  }

  /**
   * 
   * @returns {string} The name of the cookie
   */
  public getJwtCookieName(): string {
    return `LoginID_${this.config.appId}_token`
  }

  /**
   * Set jwt token to localstorage
   * @param {string} jwt Configuration object for LoginID API, including the base URL.
   */
  public setJwtCookie(jwt: string) {
    const token = parseJwt(jwt)
    const expiry = new Date(token.exp * 1000).toUTCString()
    const cookie = `${this.getJwtCookieName()}=${jwt}; expires=${expiry}`
    setCookie(cookie)
  }

  /**
   * Retrieves the JWT access token.
   * @returns {string | undefined} The JWT access token.
   */
  public getJwtCookie(): string | undefined {
    return getCookie(this.getJwtCookieName())
  }
  
  /**
     * checks if the user is logged in.
     * @returns {boolean}
     */
  public isLoggedIn(): boolean {
    return !!this.getJwtCookie()
  }
  
  /**
     * deletes the jwt cookie.
     * @returns {boolean}
     */
  public signout() {
    deleteCookie(this.getJwtCookieName())
  }
}

export default LoginIDBase
