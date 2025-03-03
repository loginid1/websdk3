import LocalStorageWrapper from "./local-storage"

const deviceStorageKey = (appId: string) => `LoginID_${appId}_device-id`

/**
 * The DeviceStore class provides static methods to persist and retrieve
 * a device ID associated with a LoginID application.
 */
export class DeviceStore extends LocalStorageWrapper {
  public static persistDeviceId(appId: string, deviceId?: string): void {
    this.setItem(deviceStorageKey(appId), deviceId)
  }

  public static getDeviceId(appId: string): string {
    return this.getItem(deviceStorageKey(appId)) || ''
  }
}
