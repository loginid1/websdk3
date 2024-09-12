// Copyright (C) LoginID
import { createUUID } from '../../utils'
import { 
  AllOptions,
  Complete,
  ConfirmTransactionOptions,
} from '../types'

/**
 * Merges provided options with default values for passkey options.
 * 
 * @param {string} username Username for which the passkey options are being created.
 * @param {string} authzToken Authorization token for the passkey options.
 * @param {PasskeyOptions} options Options to merge with default values.
 * @returns {Complete<PasskeyOptions>} The complete set of passkey options with defaults applied.
 */
export const passkeyOptions = (username: string, authzToken: string, options: AllOptions): Complete<AllOptions> => {
  return {
    ...options,
    authzToken: authzToken || options.authzToken || '',
    // NOTE: we will always be defaulting to email for now
    usernameType: options.usernameType || 'email',
    displayName: options.displayName || username,
    callbacks: options.callbacks || {},
  }
}

/**
 * Merges provided options with default values for transaction confirmation options.
 * 
 * @param {string} username Username for which the transaction confirmation options are being created.
 * @param {ConfirmTransactionOptions} options Options to merge with default values.
 * @returns {Complete<ConfirmTransactionOptions>} The complete set of transaction confirmation options with defaults applied.
 */
export const confirmTransactionOptions = (username: string, options: ConfirmTransactionOptions): Complete<ConfirmTransactionOptions> => {
  return {
    ...passkeyOptions(username, '', options),
    txType: options.txType || 'raw',
    nonce: options.nonce || createUUID(),
  }
}
