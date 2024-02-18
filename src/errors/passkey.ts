import {PasskeyErrorCode} from './types'

/**
 * Error class for passkey-related errors.
 */
class PasskeyError extends Error {
  public readonly code: PasskeyErrorCode

  /**
   * Initializes a new instance of PasskeyError with the provided message, code, and original error.
   * 
   * @type {Error}
   * @memberof PasskeyError
   */
  constructor(message: string, code: PasskeyErrorCode, originalError: Error) {
    super(message)
    this.code = code
    this.cause = originalError
  }
}

export default PasskeyError
