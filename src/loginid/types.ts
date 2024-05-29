import {
  ApiError,
  CreationResult,
  DeviceInfo,
  GenerateCodeRequestBody,
  RegInitRequestBody,
  User,
} from '../api'

export type UsernameType = User['usernameType']
export type DeviceInfoRequestBody = DeviceInfo
export type MFA = RegInitRequestBody['mfa']
export type Transports = CreationResult['transports']
export type CodePurpose = GenerateCodeRequestBody['purpose']

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
	codePurpose?: CodePurpose
}

//TODO: add attestationFormats
export interface RegisterWithPasskeyOptions extends PasskeyOptions {
	mfa?: MFA
	session?: string
}

export interface ConfirmTransactionOptions extends PasskeyOptions {
	txType?: string
	nonce?: string
}

export interface PasskeyResult {
	jwtAccess: string
}

export { ApiError }
