import LoginIDBase from './base'
import Passkeys from './passkeys'
import Code from './code'
import PasskeyManager from './passkey-manager'
import {applyMixins} from '../utils'
import type {LoginIDConfig} from './types'

interface LoginIDWebSDK extends Passkeys, Code, PasskeyManager {}

class LoginIDWebSDK extends LoginIDBase {
  constructor(config: LoginIDConfig) {
    super(config)
  }
}

applyMixins(LoginIDWebSDK, [LoginIDBase, Passkeys, Code, PasskeyManager])

export default LoginIDWebSDK
