import LoginIDBase from './base'
import MFA from './controllers/mfa'
import {applyMixins} from '../utils'
import Utils from './controllers/utils'
import type { LoginIDConfig } from './types'

interface LoginIDMfa extends MFA, Utils {}

class LoginIDMfa extends LoginIDBase {
  constructor(config: LoginIDConfig) {
    super(config)
  }
}

applyMixins(LoginIDMfa, [LoginIDBase, MFA, Utils])

export default LoginIDMfa
