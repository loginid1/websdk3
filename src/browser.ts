import {UAParser} from 'ua-parser-js'
import {deviceInfoRequestBody} from './api/models/deviceInfoRequestBody'

/**
 * Retrieves default device information based on the user agent for LoginID service (gen3).
 * This function parses the user agent string to extract information about the client,
 * such as browser name, version, operating system, and architecture.
 * It constructs a deviceInfoRequestBody object containing this information and returns it.
 */
const defaultDeviceInfo = (): deviceInfoRequestBody => {
  const device: deviceInfoRequestBody = {
    clientType: 'browser',
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  }

  return device
}

/**
 * Compares two browser version strings.
 * It splits the version strings into their numerical components and compares them sequentially.
 * Each version string is expected to be in the format '122.1.5'.
 * The method returns -1 if the first version is lower, 1 if it is higher, or 0 if they are equal.
 * */
const compareBrowserVersions = (version1: string, version2: string): number => {
  const parts1 = version1.split('.').map(Number)
  const parts2 = version2.split('.').map(Number)

  const maxLength = Math.max(parts1.length, parts2.length)

  for (let i = 0; i < maxLength; i++) {
    // If one of the versions is shorter, treat missing parts as 0
    const part1 = i < parts1.length ? parts1[i] : 0
    const part2 = i < parts2.length ? parts2[i] : 0

    if (part1 < part2) {
      return -1
    } else if (part1 > part2) {
      return 1
    }
  }

  return 0
}

/**
 * Checks if platform authenticator available
 * */
async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  try {
    if (
      !window.PublicKeyCredential
			|| !window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable
    ) {
      return false
    }
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch (err) {
    return false
  }
}

/**
 * Checks if conditional UI is available
 * */
async function isConditionalUIAvailable(): Promise<boolean> {
  try {
    if (
      !window.PublicKeyCredential
      || !window.PublicKeyCredential.isConditionalMediationAvailable
    ) {
      return false
    }
    return await window.PublicKeyCredential.isConditionalMediationAvailable()
  } catch (err) {
    return false
  }
}

interface DoesDeviceSupportPasskeysResponse {
	solution: string
	deviceSupported: boolean
}

/**
 * Attempts to provide a solution for missing platform authenticator
 */
async function doesDeviceSupportPasskeys(): Promise<DoesDeviceSupportPasskeysResponse> {
  const ua = new UAParser(window.navigator.userAgent).getResult()
  const response: DoesDeviceSupportPasskeysResponse = {
    solution: '',
    deviceSupported: false,
  }

  //check if browser is really outdated
  //realistically, this should never happen
  if (!window.PublicKeyCredential) {
    response.solution = 'Your browser seems to be outdated. Please upgrade to the latest version.'
    return response
  }

  //check if platform authenticator is available
  const platformAuthExists = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  if (!platformAuthExists) {
    switch (ua.os.name) {
    case 'Mac OS': {
      const browserVersion = ua.browser.version || ''
      if (ua.browser.name === 'Firefox' && compareBrowserVersions(browserVersion, '122.0') < 0) {
        response.solution = 'Please update your Firefox browser to the latest version.'
        return response
      }

      response.solution = 'Enable Touch ID on your device.'
      return response
    }
    case 'iOS':
      response.solution = 'Enable Face ID or Touch ID on your device.'
      return response
    case 'Windows':
      response.solution = 'Enable Windows Hello on your device. See here: https://support.microsoft.com/en-us/windows/learn-about-windows-hello-and-set-it-up-dae28983-8242-bb2a-d3d1-87c9d265a5f0.'
      return response
    case 'Android':
      if (ua.browser.name === 'Firefox') {
        response.solution = 'Passkeys may not be supported on your Firefox browser. Please switch to a Chromium browser.'
        return response
      }
      response.solution = 'Enable device unlock via fingerprint, PIN, or facial recognition on your device.'
      return response
    default:
      response.solution = 'Enable device unlock features such as fingerprint, PIN, or facial recognition.'
      return response
    }
  }

  response.deviceSupported = true
  return response
}

export type {
  DoesDeviceSupportPasskeysResponse,
}
export {
  defaultDeviceInfo,
  doesDeviceSupportPasskeys,
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
}
