// Copyright (C) LoginID

import { DeviceInfo } from "../../api";

/**
 * Retrieves default device information based on the user agent for LoginID service (gen3).
 * This function parses the user agent string to extract information about the client,
 * such as browser name, version, operating system, and architecture.
 * It constructs a deviceInfoRequestBody object containing this information and returns it.
 */
export const defaultDeviceInfo = (deviceId?: string): DeviceInfo => {
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
export const isPlatformAuthenticatorAvailable = async (): Promise<boolean> => {
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
};

/**
 * Checks if conditional UI is available
 * */
export const isConditionalUIAvailable = async (): Promise<boolean> => {
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
};

/**
 * Used to access a specific cookie
 *
 * @param {string} name The name of the targetted cookie
 * @returns
 */
export const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts && parts.length === 2) {
    return parts.pop()!.split(";").shift();
  }
};

/**
 * Used to set a cookie on the browser
 *
 * @param {string} cookie The full cookie string
 */
export const setCookie = (cookie: string) => {
  document.cookie = cookie;
};

/**
 * Used to delete a cookie on the browser
 *
 * @param {string} name The name of the targetted cookie
 */
export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=${new Date()}`;
};
