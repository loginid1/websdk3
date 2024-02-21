import {
  ApiError,
  creationResultRequestBody,
  deviceInfoRequestBody,
  RegRegInitRequestBody,
  userRequestBody
} from '../api'

export type UsernameType = userRequestBody['usernameType']
export type DeviceInfoRequestBody = deviceInfoRequestBody
export type MFA = RegRegInitRequestBody['mfa']
export type Transports = creationResultRequestBody['transports']

export interface LoginIDConfig {
	baseUrl: string
	appId: string
	appName: string
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

export interface PasskeyResult {
	jwtAccess: string
}

export { ApiError }
