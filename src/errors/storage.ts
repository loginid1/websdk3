// Copyright (C) LoginID

/**
 * Error class for storage related errors.
 */
class StorageError extends Error {

  /**
   * Initializes a new instance of StorageError with the provided message.
   * 
   * @type {Error}
   * @memberof StorageError
   */
  constructor(message: string) {
    super(message)
    this.name = 'StorageError'
  }
}

export default StorageError
