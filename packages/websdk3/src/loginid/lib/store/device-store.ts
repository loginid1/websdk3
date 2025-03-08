// Copyright (C) LoginID

const deviceStorageKey = (appId: string) => `LoginID_${appId}_device-id`;

/**
 * The DeviceStore class provides static methods to persist and retrieve
 * a device ID associated with a LoginID application.
 */
export class DeviceStore {
  public static persistDeviceId(appId: string, deviceId?: string): void {
    if (deviceId) {
      localStorage.setItem(deviceStorageKey(appId), deviceId);
    }
  }

  public static getDeviceId(appId: string): string {
    return localStorage.getItem(deviceStorageKey(appId)) || "";
  }
}
