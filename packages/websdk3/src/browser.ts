// Copyright (C) LoginID

import { DeviceInfo } from "./api/";

/**
 * Retrieves default device information based on the user agent for LoginID service (gen3).
 * This function parses the user agent string to extract information about the client,
 * such as browser name, version, operating system, and architecture.
 * It constructs a deviceInfoRequestBody object containing this information and returns it.
 */
const defaultDeviceInfo = (deviceId?: string): DeviceInfo => {
  const device: DeviceInfo = {
    clientType: "browser",
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    // Service will try and fill in the missing fields
    clientName: "",
    clientVersion: "",
    osName: "",
    osVersion: "",
    osArch: "",
  };

  if (deviceId) {
    device.deviceId = deviceId;
  }

  return device;
};

/**
 * Checks if platform authenticator available
 * */
async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  try {
    if (
      !window.PublicKeyCredential ||
      !window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable
    ) {
      return false;
    }
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

/**
 * Checks if conditional UI is available
 * */
async function isConditionalUIAvailable(): Promise<boolean> {
  try {
    if (
      !window.PublicKeyCredential ||
      !window.PublicKeyCredential.isConditionalMediationAvailable
    ) {
      return false;
    }
    return await window.PublicKeyCredential.isConditionalMediationAvailable();
  } catch {
    return false;
  }
}

export {
  defaultDeviceInfo,
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
};
