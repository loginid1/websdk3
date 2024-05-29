import LoginIDBase from './base'
import {DeletePasskeyOptions, ListPasskeysOptions, LoginIDConfig, RenamePasskeyOptions} from './types'
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
   * @param {string} authToken Authorization token to authenticate the request.
   * @returns {Promise<PasskeysPasskeyResponseCollection>} A collection of passkeys.
   */
  async listPasskeys(options: ListPasskeysOptions = {}): Promise<PasskeyCollection> {
    const token = this.getToken(options)

    return await this.service
      .passkeys
      .passkeysPasskeysList({authorization: token})
  }

  /**
   * Renames a specified passkey.
   * @param {string} authToken Authorization token to authenticate the request.
   * @param {string} id The ID of the passkey to rename.
   * @param {string} name The new name for the passkey.
   * @returns {Promise<null>} A promise that resolves to null upon successful completion.
   */
  async renamePasskey(id: string, name: string, options: RenamePasskeyOptions = {}): Promise<null> {
    const token = this.getToken(options)

    const passkeyRenameRequestBody: PasskeyRenameRequestBody = {
      name: name
    }

    await this.service
      .passkeys
      .passkeysPasskeyRename({
        authorization: token,
        id: id,
        requestBody: passkeyRenameRequestBody
      })

    return null
  }

  /**
   * Deletes a specified passkey.
   * @param {string} authToken Authorization token to authenticate the request.
   * @param {string} id The ID of the passkey to delete.
   * @returns {Promise<null>} A promise that resolves to null upon successful deletion.
   */
  async deletePasskey(id: string, options: DeletePasskeyOptions = {}): Promise<null> {
    const token = this.getToken(options)

    await this.service
      .passkeys
      .passkeysPasskeyDelete({
        authorization: token,
        id: id
      })

    return null
  }
}

export default PasskeyManager
