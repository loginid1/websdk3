import PasskeyError from '../errors/passkey'

/**
 * Identifies the error that occurred during passkey creation.
 * 
 * @param {Error} error The error that occurred during passkey creation.
 * @param {CredentialCreationOptions} options The options used to create the passkey.
 * @returns {PasskeyError | Error} The identified error.
 */
export const identifyCreateError = (
  error: Error,
  options: CredentialCreationOptions
): PasskeyError | Error => {
  const name = error.name
  const {publicKey} = options

  if (name === 'ConstraintError') {
    if (publicKey?.authenticatorSelection?.requireResidentKey === true) {
      return new PasskeyError(
        'Your device does not support discoverable credentials',
        'ERROR_DISCOVERABLE_CREDENTIALS_UNSUPPORTED',
        error
      )
    }

    if (publicKey?.authenticatorSelection?.userVerification === 'required') {
      return new PasskeyError(
        'Your device does not support user verification',
        'ERROR_USER_VERIFICATION_UNSUPPORTED',
        error
      )
    }
  }

  // This is the most import error to catch. It means that a passkey already exists
  // within the authenticator for this current user.
  if (name === 'InvalidStateError') {
    return new PasskeyError(
      'A passkey already exists on your device',
      'ERROR_PASSKEY_EXISTS',
      error
    )
  }

  // Platforms overload this error and it's not always clear what the actual error is.
  // Best to generalize it.
  if (name === 'NotAllowedError') {
    return new PasskeyError(
      'Passkey creation has failed',
      'ERROR_GENERAL_ERROR_SEE_CAUSE_FIELD',
      error
    )
  }

  if (name === 'NotSupportedError') {
    return new PasskeyError(
      'Your device does not support the algorithms required for passkey creation',
      'ERROR_ALGORITHMS_UNSUPPORTED',
      error
    )
  }

  if (name === 'SecurityError') {
    const rpId = publicKey?.rp?.id
    if (rpId !== window.location.hostname) {
      return new PasskeyError(
        `The domain of the relying party (${rpId}) is invalid for this domain`,
        'ERROR_DOMAIN_MISMATCH',
        error
      )
    }
  }

  if (name === 'UnknownError') {
    return new PasskeyError(
      'Your device could not process the requested options or could not create a new passkey',
      'ERROR_AUTHENTICATOR_UNKNOWN_ERROR',
      error
    )
  }

  return error
}

/**
 * Identifies the error that occurred during passkey authentication.
 * 
 * @param {Error} error The error that occurred during passkey authentication.
 * @param {CredentialRequestOptions} options The options used to authenticate with the passkey.
 * @returns {PasskeyError | Error} The identified error.
 */
export const identifyGetError = (
  error: Error,
  options: CredentialRequestOptions
): PasskeyError | Error => {
  const name = error.name
  const {publicKey} = options

  if (name === 'AbortError') {
    if (options.signal instanceof AbortSignal) {
      return new PasskeyError(
        'Passkey authentication has been aborted',
        'ERROR_PASSKEY_ABORTED',
        error
      )
    }
  }

  // Platforms overload this error and it's not always clear what the actual error is.
  // Best to generalize it.
  if (name === 'NotAllowedError') {
    return new PasskeyError(
      'Passkey authentication has failed',
      'ERROR_GENERAL_ERROR_SEE_CAUSE_FIELD',
      error
    )
  }

  if (name === 'SecurityError') {
    const rpId = publicKey?.rpId
    if (rpId !== window.location.hostname) {
      return new PasskeyError(
        `The domain of the relying party (${rpId}) is invalid for this domain`,
        'ERROR_DOMAIN_MISMATCH',
        error
      )
    }
  }

  if (name === 'UnknownError') {
    return new PasskeyError(
      'Your device could not process the requested options or could not authenticate with a passkey',
      'ERROR_AUTHENTICATOR_UNKNOWN_ERROR',
      error
    )
  }

  return error
}

/**
 * Refreshes an existing WebAuthn AbortController by aborting the current request and initiating a new controller.
 * This function is useful for handling scenarios where a WebAuthn request needs to be programmatically cancelled
 * to handle new user interactions.
 * 
 * @param {AbortController} previous The previous AbortController instance that needs to be aborted.
 * @returns {AbortController} A new AbortController instance, ready to be used for a new WebAuthn request.
 */
export const renewWebAuthnAbortController = (
  previous: AbortController
): AbortController => {
  const error = new Error('Cancelling current WebAuthn request')
  error.name = 'AbortError'
  previous.abort(error)
  const controller = new AbortController()
  return controller
}
