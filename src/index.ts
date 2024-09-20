import LoginIDWebSDK from './loginid'
import AbortError from './errors/abort'
import PasskeyError from './errors/passkey'
import {WebAuthnHelper} from './webauthn/webauthn-helper'
import {createPasskeyCredential, getPasskeyCredential} from './loginid/lib/webauthn'
import type {DoesDeviceSupportPasskeysResponse} from './browser'
import {
  canCreatePasskey,
  doesDeviceSupportPasskeys,
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable
} from './browser'

export {
  canCreatePasskey,
  createPasskeyCredential,
  doesDeviceSupportPasskeys,
  getPasskeyCredential,
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
  AbortError,
  LoginIDWebSDK,
  PasskeyError,
  WebAuthnHelper
}
export type {DoesDeviceSupportPasskeysResponse}

export * as LoginIDAPI from './api'
export * from './loginid/types'

export default LoginIDWebSDK
