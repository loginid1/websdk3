// Copyright (C) LoginID

import { LocalStorageWrapper } from "./local-storage";

const appStorageKey = (appId: string, key: string) => `LoginID_${appId}_${key}`;
const deviceIdKey = "device-id";
const rpIdKey = "rp-id";

/**
 * A general storage utility class for managing application-specific data
 * (e.g., rpId, etc.) using localStorage.
 */
export class AppStore extends LocalStorageWrapper {
  /**
   * Persists the deviceId for a given LoginID application.
   *
   * @param {string} appId - The app identifier.
   * @param {string} [deviceId] - The device identifier to store.
   */
  public static persistDeviceId(appId: string, deviceId?: string): void {
    this.setItem(appStorageKey(appId, deviceIdKey), deviceId);
  }

  /**
   * Retrieves the deviceId for a given LoginID application.
   *
   * @param {string} appId - The app identifier.
   * @returns {string | null} - The stored deviceId or null if not found.
   */
  public static getDeviceId(appId: string): string {
    return this.getItem(appStorageKey(appId, deviceIdKey)) || "";
  }

  /**
   * Persists the rpId for a given app.
   *
   * @param {string} appId - The app identifier.
   * @param {string} [rpId] - The relying party ID to store.
   */
  public static persistRpId(appId: string, rpId?: string): void {
    this.setItem(appStorageKey(appId, rpIdKey), rpId);
  }

  /**
   * Retrieves the rpId for a given app.
   *
   * @param {string} appId - The app identifier.
   * @returns {string | null} - The stored rpId or null if not found.
   */
  public static getRpId(appId: string): string | null {
    return this.getItem(appStorageKey(appId, rpIdKey));
  }
}
