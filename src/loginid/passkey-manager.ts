import LoginIDBase from './base'
import {LoginIDConfig} from './types'
import type {PasskeyCollection, PasskeyRenameRequestBody} from '../api'

/**
 * Extends LoginIDBase to manage Passkeys, including listing, renaming, and deleting passkeys.
 */
class PasskeyManager extends LoginIDBase {
  /**
   * Initializes a new instance of PasskeyManager with the provided configuration.
   * @param {LoginIDConfig} config Configuration object for LoginID.
   */
  constructor(config: LoginIDConfig) {
    super(config)
  }

  /**
   * Lists all passkeys associated with the account identified by the authToken.
   * @returns {Promise<PasskeysPasskeyResponseCollection>} A collection of passkeys.
   */
  async listPasskeys(): Promise<PasskeyCollection> {
    return await this.service
      .passkeys
      .passkeysPasskeysList()
  }

  /**
   * Renames a specified passkey.
   * @param {string} id The ID of the passkey to rename.
   * @param {string} name The new name for the passkey.
   * @returns {Promise<null>} A promise that resolves to null upon successful completion.
   */
  async renamePasskey(id: string, name: string): Promise<null> {
    const passkeyRenameRequestBody: PasskeyRenameRequestBody = {
      name: name
    }

    await this.service
      .passkeys
      .passkeysPasskeyRename({
        id: id,
        requestBody: passkeyRenameRequestBody
      })

    return null
  }

  /**
   * Deletes a specified passkey.
   * @param {string} id The ID of the passkey to delete.
   * @returns {Promise<null>} A promise that resolves to null upon successful deletion.
   */
  async deletePasskey(id: string): Promise<null> {
    await this.service
      .passkeys
      .passkeysPasskeyDelete({
        id: id
      })

    return null
  }
}

export default PasskeyManager
