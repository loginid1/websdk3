import LoginIDWebSDK from './loginid'
import LoginIDMfa from './loginid/mfa'
import AbortError from './errors/abort'
import PasskeyError from './errors/passkey'
import {WebAuthnHelper} from './webauthn/webauthn-helper'
import {TrustStore} from './loginid/lib/store/trust-store'
import LoginIDConfigValidator from './loginid/lib/validators'
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
  LoginIDConfigValidator,
  PasskeyError,
  TrustStore,
  WebAuthnHelper,
}
export type {Passkey, PasskeyCollection} from './api'

export * as LoginIDAPI from './api'
export * from './loginid/types'

export default LoginIDWebSDK
