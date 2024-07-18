import SessionManager from './lib/session'
import LoginIDConfigValidator from './lib/validators'
import { LoginIDService } from '../api/LoginIDService'
import type { LoginIDConfig } from './types'

/**
 * Provides a base class for integrating with the LoginID API services.
 * This class initializes the common configuration and service needed for derived classes to interact with LoginID services.
 */
class LoginIDBase {
  /**
   * Holds the configuration settings for the LoginID integration, including API base URL.
   */
  protected readonly config: LoginIDConfigValidator

  /**
   * Instance of LoginIDService, providing access to the LoginID API methods.
   */
  protected readonly service: LoginIDService

  /**
   * Instance of SessionManager, providing access to the session management methods.
   */
  public readonly session: SessionManager

  /**
   * Constructs a new instance of the LoginIDBase class, initializing the service with the provided configuration.
   * @param {LoginIDConfig} config Configuration object for LoginID API, including the base URL.
   */
  constructor(config: LoginIDConfig) {
    this.config = new LoginIDConfigValidator(config)
    this.service = new LoginIDService({BASE: config.baseUrl})
    this.session = new SessionManager(config)
  }
}

export default LoginIDBase
