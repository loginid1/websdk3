// Copyright (C) LoginID
import LoginIDConfigValidator from './validators'
import { LoginIDConfig, PasskeyOptions, SessionInfo } from '../types'
import { 
  deleteCookie,
  getCookie,
  parseJwt,
  setCookie
} from '../../utils'

class SessionManager {
  /**
   * Holds the configuration settings for the LoginID integration, including API base URL.
   */
  private config: LoginIDConfigValidator

  /**
   * Initializes a new instance of SessionManager with the provided configuration.
   * 
   * @param {LoginIDConfig} config Configuration object for LoginID.
   */
  constructor(config: LoginIDConfig) {
    this.config = new LoginIDConfigValidator(config)
  }

  /**
   * Retrieves the authentication token from the provided options or from cookies if not available in options.
   * 
   * @param {PasskeyOptions} options Options containing the token.
   * @returns {string} The authentication token.
   */
  public getToken(options: PasskeyOptions): string {
    if (options.authzToken) {
      return options.authzToken
    } else {
      const token = this.getJwtCookie()
      if (token) {
        return token
      } else {
        return ''
      }
    }
  }

  /**
   * Retrieves the currently authenticated user's session information.
   * 
   * @returns {LoginIDUser | null} The currently authenticated user's information, including username and id. 
   * It will return null if user is not authenticated
   */
  public getSessionInfo(): SessionInfo | null {
    if (!this.isLoggedIn()) {
      return null
    }
    const data = parseJwt(this.getJwtCookie() || '{}')
    const user: SessionInfo = {
      username: data.username,
      id: data.sub
    }
    return user
  }

  /**
   * Returns the dynamic Cookie name holding the authorization token for the given application.
   * 
   * @returns {string} The name of the cookie
   */
  public getJwtCookieName(): string {
    return `LoginID_${this.config.getAppId()}_token`
  }

  /**
   * Set jwt token to local Cookie
   * 
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
   * 
   * @returns {string | undefined} The JWT access token.
   */
  public getJwtCookie(): string | undefined {
    return getCookie(this.getJwtCookieName())
  }
  
  /**
   * Checks if the user is logged in.
   * 
   * @returns {boolean}
   */
  public isLoggedIn(): boolean {
    return !!this.getJwtCookie()
  }
  
  /**
   * Deletes the jwt cookie.
   * 
   * @returns {boolean}
   */
  public logout() {
    deleteCookie(this.getJwtCookieName())
  }
}

export default SessionManager
