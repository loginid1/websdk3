// Copyright (C) LoginID

import { LocalStorageWrapper } from "./local-storage";

/**
 * A utility class that marks a given localStorage key as `true`.
 *
 * This is useful for simple feature flags, acknowledgements,
 * or tracking if a user has completed a specific action.
 *
 * Extends {@link LocalStorageWrapper} to reuse its localStorage handling logic.
 */
export class LocalStorageFlagger extends LocalStorageWrapper {
  /**
   * Sets a boolean `true` value in localStorage under the provided key.
   *
   * @param {string} key - The key to stamp.
   */
  public static stamp(key: string): void {
    this.setItem<boolean>(key, true);
  }

  /**
   * Checks if a key has been stamped (i.e., set to `true`).
   *
   * @param {string} key - The key to check.
   * @returns {boolean} - `true` if the key exists and is `true`, otherwise `false`.
   */
  public static isStamped(key: string): boolean {
    return this.getItem<boolean>(key) === true;
  }
}
