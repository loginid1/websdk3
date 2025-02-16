import IndexedDBWrapper from './indexdb'
import { TrustIDRecord } from '../../types'
import { signWithTrustId, toTrustIDPayload } from '../tokens'
import { exportPublicKeyJwk, generateES256KeyPair } from '../../../utils'

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
   * @param {string} challenge - The challenge for the trust ID.
   * @returns {Promise<string>} The signed trust ID.
   */
  public async setTrustId(username: string, challenge: string): Promise<string> {
    const keyPair = await generateES256KeyPair()
    const publicKey = await exportPublicKeyJwk(keyPair)
    const token = toTrustIDPayload(this.appId, username, challenge, '', publicKey)
    const trustId = await signWithTrustId(token, keyPair.privateKey)

    await this.putRecord({ id: token.sub, username, keyPair })

    return trustId
  }

  /**
   * Signs a challenge using the stored Trust ID.
   * @param {string} username - The username to retrieve the Trust ID for.
   * @param {string} challenge - The challenge to sign.
   * @returns {Promise<string>} The signed trust ID.
   */
  public async signWithTrustId(username: string, challenge: string): Promise<string> {
    const record = await this.getByIndex<TrustIDRecord>(nameIndex, username)
    const token = toTrustIDPayload(this.appId, username, challenge, record.id)
    const trustId = await signWithTrustId(token, record.keyPair.privateKey)
    return trustId
  }
}
