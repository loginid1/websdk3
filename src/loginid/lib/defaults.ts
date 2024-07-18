// Copyright (C) LoginID
import { createUUID } from '../../utils'
import { 
  Complete,
  ConfirmTransactionOptions,
  PasskeyOptions,
} from '../types'

/**
 * Merges provided options with default values for passkey options.
 * @param {string} username Username for which the passkey options are being created.
 * @param {PasskeyOptions} options Options to merge with default values.
 * @returns {Complete<PasskeyOptions>} The complete set of passkey options with defaults applied.
 */
export const passkeyOptions = (username: string, options: PasskeyOptions): Complete<PasskeyOptions> => {
  return {
    ...options,
    // Default to email if usernameType is not provided
    token: options.token || '',
    usernameType: options.usernameType || 'email',
    displayName: options.displayName || username,
  }
}

/**
 * Merges provided options with default values for transaction confirmation options.
 * @param {string} username Username for which the transaction confirmation options are being created.
 * @param {ConfirmTransactionOptions} options Options to merge with default values.
 * @returns {Complete<ConfirmTransactionOptions>} The complete set of transaction confirmation options with defaults applied.
 */
export const confirmTransactionOptions = (username: string, options: ConfirmTransactionOptions): Complete<ConfirmTransactionOptions> => {
  return {
    ...passkeyOptions(username, options),
    txType: options.txType || 'raw',
    nonce: options.nonce || createUUID(),
  }
}
