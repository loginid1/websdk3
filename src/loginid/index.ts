import LoginIDBase from './base'
import OTP from './controllers/otp'
import Utils from './controllers/utils'
import Passkeys from './controllers/passkeys'
import PasskeyManager from './controllers/passkey-manager'
import {applyMixins} from '../utils'
import type {LoginIDConfig} from './types'

interface LoginIDWebSDK extends Passkeys, OTP, PasskeyManager, Utils {}

class LoginIDWebSDK extends LoginIDBase {
  constructor(config: LoginIDConfig) {
    super(config)
  }
}

applyMixins(LoginIDWebSDK, [LoginIDBase, Passkeys, OTP, PasskeyManager, Utils])

export default LoginIDWebSDK
