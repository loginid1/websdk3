import {
  ApiError,
  AuthInit,
  CreationResult,
  DeviceInfo,
  User,
} from '../api'

export type Complete<T> = {
  [P in keyof T]-?: T[P];
}

export type UsernameType = User['usernameType']
export type DeviceInfoRequestBody = DeviceInfo
export type Transports = CreationResult['transports']

export type Message = 'email' | 'sms'

export interface LoginIDConfig {
  baseUrl: string
  appId: string
}

export type FallbackMethods = AuthInit['fallbackMethods'] | AuthInit['crossAuthMethods']
export type CrossAuthMethodsResult = {
  [K in FallbackMethods[number]]: boolean;
};

export interface FallbackMethodsResult {
  fallbackOptions: CrossAuthMethodsResult
}

export type FallbackCallback = (username: string, options: FallbackMethodsResult) => Promise<void>
export type SuccessCallback = (result: PasskeyResult) => Promise<void>

export interface Callbacks {
  onFallback?: FallbackCallback
  onSuccess?: SuccessCallback
}

export interface PasskeyOptions {
  token?: string
  displayName?: string
  usernameType?: UsernameType
  callbacks?: Callbacks
  // disable hints for now
  //hints?: string[]
}

export interface PasskeyManagementOptions {
  token?: string
}

export interface ListPasskeysOptions extends PasskeyManagementOptions {}
export interface RenamePasskeyOptions extends PasskeyManagementOptions {}
export interface DeletePasskeyOptions extends PasskeyManagementOptions {}

export interface AuthenticateWithPasskeysOptions extends PasskeyOptions {
  // autoFill is conditional UI
  autoFill?: boolean
  abortSignal?: AbortSignal
}

//TODO: add attestationFormats
export interface RegisterWithPasskeyOptions extends PasskeyOptions {
  session?: string
}

export interface ConfirmTransactionOptions extends PasskeyOptions {
  txType?: string
  nonce?: string
}

export interface SendCodeOptions {
  usernameType?: UsernameType
}

export interface PasskeyResult {
  jwtAccess: string
  deviceID?: string
}

export interface LoginIDUser {
  username: string
  id: string
}

export interface VerifyConfigResult {
  isValid: boolean
  solution?: string
  message?: string
  code?: string
}

export { ApiError }
