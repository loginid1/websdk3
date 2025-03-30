// Copyright (C) LoginID

/**
 * Custom error class for handling postMessage-related errors.
 * Extends the native JavaScript `Error` class.
 */
export class MessagesError extends Error {
  /**
   * Creates an instance of MessagesError.
   * @param {string} message - The error message to be displayed.
   */
  constructor(message: string) {
    super(message);
    this.name = "MessagesError";
  }
}
