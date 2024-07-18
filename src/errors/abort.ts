// Copyright (C) LoginID

/**
 * Error class for abort-related errors.
 */
class AbortError extends Error {

  /**
   * Initializes a new instance of AbortError with the provided message.
   * 
   * @type {Error}
   * @memberof AbortError
   */
  constructor(message: string) {
    super(message)
    this.name = 'AbortError'
  }
}

export default AbortError
