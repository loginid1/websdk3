import {
  ApiError,
  CreationResult,
  DeviceInfo,
  RegInitRequestBody,
  User,
} from '../api'

export type UsernameType = User['usernameType']
export type DeviceInfoRequestBody = DeviceInfo
export type MFA = RegInitRequestBody['mfa']
export type Transports = CreationResult['transports']

export interface LoginIDConfig {
	baseUrl: string
	appId: string
}

export interface PasskeyOptions {
	token?: string
	displayName?: string
	usernameType?: UsernameType
	// disable hints for now
	//hints?: string[]
}

export interface AuthenticateWithPasskeysOptions extends PasskeyOptions {
	// autoFill is conditional UI
	autoFill?: boolean
	abortSignal?: AbortSignal
}

//TODO: add attestationFormats
export interface RegisterWithPasskeyOptions extends PasskeyOptions {
	mfa?: MFA
}

export interface ConfirmTransactionOptions extends PasskeyOptions {
	txType?: string
	nonce?: string
}

export interface PasskeyResult {
	jwtAccess: string
}

export { ApiError }
