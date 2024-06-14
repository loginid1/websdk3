import {
  ApiError,
  CreationResult,
  DeviceInfo,
  User,
} from '../api'

export type UsernameType = User['usernameType']
export type DeviceInfoRequestBody = DeviceInfo
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

export interface PasskeyResult {
	jwtAccess: string
}

export interface LoginIDUser {
  username: string
  id: string
}

export { ApiError }
