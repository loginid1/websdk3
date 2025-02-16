import StorageError from '../../../errors/storage'

/**
 * Wrapper for IndexedDB operations.
 */
class IndexedDBWrapper {
  /**
   * @private @type {string} Name of the database
   */
  private dbName: string

  /**
   * @private @type {number} Version of the database
   */
  private dbVersion: number

  /** 
   * @private @type {string} Key for the object store
   */
  private storeKey: string

  /**
   * @private
   * @type {Array<{ name: string; keyPath: string; options?: IDBIndexParameters }>} 
   * List of indexes for the object store
   */
  private indexes: { name: string; keyPath: string; options?: IDBIndexParameters }[]

  /**
   * Creates an instance of IndexedDBWrapper.
   * @param {string} dbName - The name of the database.
   * @param {number} dbVersion - The version of the database.
   * @param {string} storeKey - The key for the object store.
   * @param {Array<{ name: string; keyPath: string; options?: IDBIndexParameters }>} [indexes=[]] - The indexes for the object store.
   */
  constructor(dbName: string, dbVersion: number, storeKey: string, indexes: { name: string; keyPath: string; options?: IDBIndexParameters }[] = []) {
    this.dbName = dbName
    this.dbVersion = dbVersion
    this.storeKey = storeKey
    this.indexes = indexes
  }

  /**
   * Opens the IndexedDB database.
   * @private
   * @returns {IDBOpenDBRequest} The open request for the database.
   */
  private openDb(): IDBOpenDBRequest {
    const open = indexedDB.open(this.dbName, this.dbVersion)

    open.onupgradeneeded = () => {
      const db = open.result
      if (!db.objectStoreNames.contains(this.storeKey)) {
        const store = db.createObjectStore(this.storeKey, { keyPath: 'id' })
        this.indexes.forEach(({ name, keyPath, options }) => store.createIndex(name, keyPath, options))
      }
    }

    return open
  }

  /**
   * Retrieves a record from the object store using an index.
   * @protected
   * @template T
   * @param {string} indexName - The name of the index.
   * @param {string} value - The value to search for in the index.
   * @returns {Promise<T>} A promise that resolves to the retrieved record.
   */
  protected async getByIndex<T>(indexName: string, value: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const open = this.openDb()

      open.onsuccess = () => {
        const db = open.result
        const tx = db.transaction(this.storeKey, 'readonly')
        const store = tx.objectStore(this.storeKey)
        const index = store.index(indexName)

        const request = index.get(value)

        request.onsuccess = () => {
          const result = request.result
          if (!result) {
            reject(new StorageError(`No record found for ${value} in index ${indexName}.`))
          } else {
            resolve(result)
          }
        }

        request.onerror = () => reject(new StorageError(`Failed to fetch record from index ${indexName}.`))
      }

      open.onerror = () => reject(new StorageError('Failed to open the database.'))
    })
  }

  /**
   * Inserts or updates a record in the object store.
   * @protected
   * @template T
   * @param {T} record - The record to be stored.
   * @returns {Promise<void>} A promise that resolves when the record is successfully stored.
   */
  protected async putRecord<T>(record: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const open = this.openDb()

      open.onsuccess = () => {
        const db = open.result
        const tx = db.transaction(this.storeKey, 'readwrite')
        const store = tx.objectStore(this.storeKey)

        const request = store.put(record)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(new StorageError('Failed to save record.'))
      }

      open.onerror = () => reject(new StorageError('Failed to open the database.'))
    })
  }
}

export default IndexedDBWrapper
