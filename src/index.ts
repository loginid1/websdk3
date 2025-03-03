import LoginIDWebSDK from './loginid'
import LoginIDMfa from './loginid/mfa'
import AbortError from './errors/abort'
import PasskeyError from './errors/passkey'
import {WebAuthnHelper} from './webauthn/webauthn-helper'
import {createPasskeyCredential, getPasskeyCredential} from './loginid/lib/webauthn'
import {
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable
} from './browser'

export {
  createPasskeyCredential,
  getPasskeyCredential,
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
  AbortError,
  LoginIDMfa,
  LoginIDWebSDK,
  PasskeyError,
  WebAuthnHelper,
}
export type {Passkey, PasskeyCollection} from './api'

export * as LoginIDAPI from './api'
export * from './loginid/types'

export default LoginIDWebSDK
