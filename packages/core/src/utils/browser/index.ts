// Copyright (C) LoginID

import { DeviceInfo } from "../../api";
import { Logger } from "../logger";

/**
 * Retrieves default device information based on the user agent for LoginID service (gen3).
 * This function parses the user agent string to extract information about the client,
 * such as browser name, version, operating system, and architecture.
 * It constructs a deviceInfoRequestBody object containing this information and returns it.
 */
export const defaultDeviceInfo = async (
  deviceId?: string,
): Promise<DeviceInfo> => {
  const webauthnClientCapabilities = JSON.stringify(
    await getClientCapabilities(),
  );
  const bluetooth = await isBluetoothAvailable();

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
    hasBluetooth: bluetooth,
    webauthnCapabilities: webauthnClientCapabilities,
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
 * Returns WebAuthn client capabilities, using the native API if available.
 * Falls back to basic checks if `getClientCapabilities()` is not supported.
 *
 * @returns {Promise<Record<string, boolean> | null>}
 * @see https://w3c.github.io/webauthn/#sctn-getClientCapabilities
 */
export const getClientCapabilities = async (): Promise<
  Record<string, boolean>
> => {
  try {
    if (!window.PublicKeyCredential) {
      return {};
    }

    if (!window.PublicKeyCredential.getClientCapabilities) {
      const iuvpaa = await isPlatformAuthenticatorAvailable();
      const icma = await isConditionalUIAvailable();

      const capabilities = {
        userVerifyingPlatformAuthenticator: iuvpaa,
        conditionalGet: icma,
      };

      return capabilities;
    }

    return await window.PublicKeyCredential.getClientCapabilities();
  } catch {
    return {};
  }
};

/**
 * Signals to the authenticator all of the valid credential IDs that the relying party (RP)
 * still holds for a specific user. This allows the authenticator to update its internal state
 * and remove any credentials that are no longer recognized by the RP (for example, after account deletion).
 *
 * This method should be called only when the current user is authenticated with a passkey.
 *
 * @param {string} rpId - The ID of the relying party (RP) sending the signal.
 * @param {string} userId - A base64url-encoded string representing the ID of the user.
 * @param {string[]} allAcceptedCredentialIds - An array of base64url-encoded credential IDs
 * representing the credentials that are still valid for the user.
 *
 * @returns {Promise<void>} A promise that resolves to `undefined` when the signal is processed.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/signalAllAcceptedCredentials_static MDN Reference}
 */
export const signalAllAcceptedCredentials = async (
  rpId: string,
  userId: string,
  allAcceptedCredentialIds: string[],
): Promise<void> => {
  try {
    if (!window.PublicKeyCredential) {
      Logger.logger.debug("PublicKeyCredential is not available.");
      return;
    }

    // @ts-expect-error: Not found in offical TypeScript types
    if (!window.PublicKeyCredential.signalAllAcceptedCredentials) {
      Logger.logger.debug("signalAllAcceptedCredentials is not available.");
      return;
    }

    // @ts-expect-error: Not found in offical TypeScript types
    await window.PublicKeyCredential.signalAllAcceptedCredentials({
      rpId: rpId,
      userId: userId,
      allAcceptedCredentialIds: allAcceptedCredentialIds,
    });
  } catch (error) {
    Logger.logger.debug(`Error at signalAllAcceptedCredentials: ${error}`);
    return;
  }
};

/**
 * Signals to the authenticator that a given credential ID was not recognized
 * by the relying party (RP) server. This allows the authenticator to remove
 * credentials that are no longer valid — for example, those associated with
 * deleted accounts, or credentials that were created on the authenticator but
 * never properly registered on the RP server.
 *
 * @param {string} rpId - The ID of the relying party (RP) sending the signal.
 * @param {string} credentialId - A base64url-encoded string representing the
 * unrecognized credential ID.
 *
 * @returns {Promise<void>} A promise that resolves to `undefined` when the
 * signal is processed.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/signalUnknownCredential_static MDN Reference}
 */
export const signalUnknownCredential = async (
  rpId: string,
  credentialId: string,
): Promise<void> => {
  try {
    if (!window.PublicKeyCredential) {
      Logger.logger.debug("PublicKeyCredential is not available.");
      return;
    }

    // @ts-expect-error: Not found in offical TypeScript types
    if (!window.PublicKeyCredential.signalUnknownCredential) {
      Logger.logger.debug("signalUnknownCredential is not available.");
      return;
    }

    // @ts-expect-error: Not found in offical TypeScript types
    await window.PublicKeyCredential.signalUnknownCredential({
      rpId: rpId,
      credentialId: credentialId,
    });
  } catch (error) {
    Logger.logger.debug(`Error at signalUnknownCredential: ${error}`);
    return;
  }
};

/**
 * Checks if Bluetooth is available on the device.
 * Note: Availability does not guarantee permission or successful connection.
 *
 * @returns {Promise<boolean>}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth/getAvailability
 */
export const isBluetoothAvailable = async (): Promise<boolean> => {
  try {
    //@ts-expect-error: Not found in offical TypeScript types
    if (!navigator.bluetooth) {
      return false;
    }
    //@ts-expect-error: Not found in offical TypeScript types
    return await navigator.bluetooth.getAvailability();
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
