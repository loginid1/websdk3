import LoginIDWebSDK from './loginid'
import PasskeyError from './errors/passkey'
import {WebAuthnHelper} from './webauthn/webauthn-helper'
import {createPasskeyCredential, getPasskeyCredential} from './webauthn'
import type {DoesDeviceSupportPasskeysResponse} from './browser'
import {doesDeviceSupportPasskeys, isConditionalUIAvailable, isPlatformAuthenticatorAvailable} from './browser'

export {
  createPasskeyCredential,
  doesDeviceSupportPasskeys,
  getPasskeyCredential,
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
  LoginIDWebSDK,
  PasskeyError,
  WebAuthnHelper
}
export type {DoesDeviceSupportPasskeysResponse}

export * from './loginid/types'
export * from './api'

export default LoginIDWebSDK
