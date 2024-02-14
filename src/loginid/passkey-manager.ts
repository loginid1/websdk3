import LoginIDBase from './base'
import {LoginIDConfig} from './types'
import type {PasskeysPasskeyRenameRequestBody} from '../api'
import type {PasskeysPasskeyResponseCollection} from '../api/models/PasskeysPasskeyResponseCollection'

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
   * @param {string} authToken Authorization token to authenticate the request.
   * @returns {Promise<PasskeysPasskeyResponseCollection>} A collection of passkeys.
   */
  async listPasskeys(authToken: string): Promise<PasskeysPasskeyResponseCollection> {
    return await this.service
      .passkeys
      .passkeysPasskeysList({authorization: authToken})
  }

  /**
   * Renames a specified passkey.
   * @param {string} authToken Authorization token to authenticate the request.
   * @param {string} id The ID of the passkey to rename.
   * @param {string} name The new name for the passkey.
   * @returns {Promise<null>} A promise that resolves to null upon successful completion.
   */
  async renamePasskey(authToken: string, id: string, name: string): Promise<null> {
    const passkeyRenameRequestBody: PasskeysPasskeyRenameRequestBody = {
      name: name
    }

    await this.service
      .passkeys
      .passkeysPasskeyRename({
        authorization: authToken,
        id: id,
        passkeyRenameRequestBody: passkeyRenameRequestBody
      })

    return null
  }

  /**
   * Deletes a specified passkey.
   * @param {string} authToken Authorization token to authenticate the request.
   * @param {string} id The ID of the passkey to delete.
   * @returns {Promise<null>} A promise that resolves to null upon successful deletion.
   */
  async deletePasskey(authToken: string, id: string): Promise<null> {
    await this.service
      .passkeys
      .passkeysPasskeyDelete({
        authorization: authToken,
        id: id
      })

    return null
  }
}

export default PasskeyManager
