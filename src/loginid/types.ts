import {
  creationResultRequestBody,
  deviceInfoRequestBody,
  RegRegInitRequestBody,
  userRequestBody
} from '../api'

export type UsernameType = userRequestBody.usernameType
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
	deviceInfo?: DeviceInfoRequestBody
	displayName?: string
	usernameType?: userRequestBody.usernameType
	hints?: string[]
}

export interface AuthenticateWithPasskeysOptions extends PasskeyOptions {}

//TODO: add attestationFormats
export interface RegisterWithPasskeyOptions extends PasskeyOptions {
	mfa?: MFA
}

export interface PasskeyResult {
	jwtAccess: string
}
