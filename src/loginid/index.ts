import LoginIDBase from './base'
import Code from './controllers/code'
import Utils from './controllers/utils'
import Passkeys from './controllers/passkeys'
import PasskeyManager from './controllers/passkey-manager'
import {applyMixins} from '../utils'
import type {LoginIDConfig} from './types'

interface LoginIDWebSDK extends Passkeys, Code, PasskeyManager, Utils {}

class LoginIDWebSDK extends LoginIDBase {
  constructor(config: LoginIDConfig) {
    super(config)
  }
}

applyMixins(LoginIDWebSDK, [LoginIDBase, Passkeys, Code, PasskeyManager, Utils])

export default LoginIDWebSDK
