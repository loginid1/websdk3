import IndexedDBWrapper from './indexdb'
import { TrustIDRecord } from '../../types'
import { signWithTrustId, toTrustIDPayload } from '../tokens'
import { exportPublicKeyJwk, generateES256KeyPair } from '../../../utils'
import StorageError from '@/src/errors/storage'

const dbVersion = 1
const nameIndex = 'username_idx'
const dbName = 'loginid-trust-store'
const trustStorageKey = (appId: string) => `LoginID_${appId}_trust-id`

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
    super(dbName, dbVersion, trustStorageKey(appId), [{ name: nameIndex, keyPath: 'username' }])
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

    await this.putRecord({ id: token.id, username, keyPair })

    return trustId
  }

  /**
   * Creates a JWS using the stored Trust ID.
   * @param {string} username - The username to retrieve the Trust ID for.
   * @returns {Promise<string>} The signed trust ID.
   */
  public async signWithTrustId(username: string): Promise<string> {
    const record = await this.getByIndex<TrustIDRecord>(nameIndex, username)
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
      console.log("Potential indexDB error: " + error)
      return ""
    }
  }
}
