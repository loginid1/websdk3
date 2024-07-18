// Copyright (C) LoginID
import AbortError from '../errors/abort'

class AbortControllerManager {
  /**
   * AbortController to manage the lifecycle of asynchronous WebAuthn requests,
   * allowing them to be cancelled when another request needs to be made.
   */
  public static abortController: AbortController = new AbortController()

  /**
   * Refreshes an existing WebAuthn AbortController by aborting the current request and initiating a new controller.
   * This function is useful for handling scenarios where a WebAuthn request needs to be programmatically cancelled
   * to handle new user interactions.
   */
  public static renewWebAuthnAbortController = () => {
    const error = new AbortError('Cancelling current WebAuthn request')
    AbortControllerManager.abortController.abort(error)
    const controller = new AbortController()
    AbortControllerManager.abortController = controller
  }
}

export default AbortControllerManager
