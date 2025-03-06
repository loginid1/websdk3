import IndexedDBWrapper from './indexdb'
import { TrustIDRecord } from '../../types'
import StorageError from '../../../errors/storage'
import { signWithTrustId, toTrustIDPayload } from '../tokens'
import { exportPublicKeyJwk, generateES256KeyPair } from '../../../utils'

const dbVersion = 1
const appIdIndex = 'app_id_idx'
const nameIndex = 'username_idx'
const dbName = 'loginid-trust-store'
const trustStorageKey =`LoginID_trust-id`
const appIdUsernameCompositeIndex = 'app_id_username_idx'

/**
 * TrustStore extends IndexedDBWrapper to manage trust ID records.
 */
export class TrustStore extends IndexedDBWrapper {
  /** App ID associated with this store */
  private readonly appId: string

  /**
   * Creates an instance of TrustStore.
   * @param {string} appId - The app ID.
   */
  constructor(appId: string) {
    super(dbName, dbVersion, trustStorageKey, [
      { name: nameIndex, keyPath: ['username'] },
      { name: appIdIndex, keyPath: ['appId'] },
      { name: appIdUsernameCompositeIndex, keyPath: ['appId', 'username'] },
    ])
    this.appId = appId
  }

  /**
   * Generates a Trust ID for a user and stores it.
   * @param {string} username - The username associated with the trust ID.
   * @returns {Promise<string>} The signed trust ID.
   */
  public async setTrustId(username: string): Promise<string> {
    const keyPair = await generateES256KeyPair()
    const publicKey = await exportPublicKeyJwk(keyPair)
    const token = toTrustIDPayload(this.appId, username)
    const trustId = await signWithTrustId(token, publicKey, keyPair.privateKey)

    await this.putRecord({ id: token.id, appId: this.appId, username, keyPair })

    return trustId
  }

  /**
   * Creates a JWS using the stored Trust ID.
   * @param {string} username - The username to retrieve the Trust ID for.
   * @returns {Promise<string>} The signed trust ID.
   */
  public async signWithTrustId(username: string): Promise<string> {
    const record = await this.getByIndex<TrustIDRecord>(appIdUsernameCompositeIndex, [this.appId, username])
    const publicKey = await exportPublicKeyJwk(record.keyPair)
    const token = toTrustIDPayload(this.appId, username, record.id)
    const trustId = await signWithTrustId(token, publicKey, record.keyPair.privateKey)
    return trustId
  }

  /**
   * Checks if a Trust ID exists for the user. If it does, signs with it; otherwise, generates and stores a new Trust ID.
   * @param {string} username - The username associated with the trust ID.
   * @returns {Promise<string>} The signed trust ID.
   */
  public async setOrSignWithTrustId(username: string): Promise<string> {
    try {
      if (!username) {
        return ""
      }
      return await this.signWithTrustId(username);
    } catch (error) {
      if (error instanceof StorageError && error.code === "ERROR_STORAGE_NOT_FOUND") {
        return await this.setTrustId(username);
      }
      console.log("IndexDB error: " + error)
      return ""
    }
  }

  /**
   * Retrieves all Trust ID records associated with the given appId.
   * @returns {Promise<TrustIDRecord[]>} A promise that resolves to an array of trust IDs.
   */
  public async getAllTrustIds(): Promise<TrustIDRecord[]> {
    try {
      const records = await this.getAllByIndex<TrustIDRecord>(appIdIndex, [this.appId]);
      return records
    } catch (error) {
      console.error("Error retrieving Trust IDs:", error);
      return [];
    }
  }

  /**
   * Retrieves a Trust ID record by username.
   * @param {string} username - The username to search for.
   * @returns {Promise<TrustIDRecord | null>} A promise that resolves to the TrustIDRecord or null if not found.
   */
  public async findByUsername(username: string): Promise<TrustIDRecord | null> {
    try {
      return await this.getByIndex<TrustIDRecord>(appIdUsernameCompositeIndex, [this.appId, username]);
    } catch (error) {
      console.error("Error retrieving Trust ID Record:", error);
      return null;
    }
  }
}
