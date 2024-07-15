// Copyright (C) LoginID
import { USER_NO_OP_ERROR } from '../loginid/errors'
import { LoginIDConfig, LoginIDUser, PasskeyOptions } from '../loginid/types'
import { 
  deleteCookie,
  getCookie,
  parseJwt,
  setCookie
} from '../utils'

class SessionManager {
  /**
   * Holds the configuration settings for the LoginID integration, including API base URL.
   */
  private config: LoginIDConfig

  /**
   * Initializes a new instance of SessionManager with the provided configuration.
   * @param {LoginIDConfig} config Configuration object for LoginID.
   */
  constructor(config: LoginIDConfig) {
    this.config = config
  }

  /**
   * Retrieves the authentication token from the provided options or from cookies if not available in options.
   * @param {PasskeyOptions} options Options containing the token.
   * @returns {string} The authentication token.
   */
  public getToken(options: PasskeyOptions): string {
    if (options.token) {
      return options.token
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
   * Retrieves the currently authenticated user's information. 
   * @returns {LoginIDUser} The currently authenticated user's information, including username and id.
   * @throws {Error} If the user is not logged in, throws USER_NO_OP_ERROR. 
   */
  public getUser(): LoginIDUser {
    if (!this.isLoggedIn()) {
      throw USER_NO_OP_ERROR
    }
    const data = parseJwt(this.getJwtCookie() || '{}')
    const user: LoginIDUser = {
      username: data.username,
      id: data.sub
    }
    return user
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

export default SessionManager
