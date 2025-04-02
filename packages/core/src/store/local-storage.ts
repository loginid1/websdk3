// Copyright (C) LoginID

export class LocalStorageWrapper {
  /**
   * Stores a value in localStorage under the specified key.
   *
   * @template T - The type of the value to be stored.
   * @param {string} key - The key under which the value will be stored.
   * @param {T} [value] - The value to store. If `undefined`, nothing is stored.
   */
  protected static setItem<T>(key: string, value?: T): void {
    if (value !== undefined) {
      const data = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, data);
    }
  }

  /**
   * Retrieves a value from localStorage by key.
   *
   * @template T - The expected type of the stored value.
   * @param {string} key - The key of the value to retrieve.
   * @returns {T | null} - The parsed value if JSON, the raw string if not JSON, or `null` if not found.
   */
  protected static getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as T;
    }
  }
}
