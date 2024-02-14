import LoginIDWebSDK from './loginid'
import {doesDeviceSupportPasskeys} from './browser'
import {createPasskeyCredential, getPasskeyCredential} from './webauthn'
import type {DoesDeviceSupportPasskeysResponse} from './browser'

export {
  createPasskeyCredential,
  doesDeviceSupportPasskeys,
  getPasskeyCredential,
  LoginIDWebSDK
}
export type {DoesDeviceSupportPasskeysResponse}

export * from './loginid/types'

export default LoginIDWebSDK
