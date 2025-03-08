// Copyright (C) LoginID

import PasskeyManager from "./controllers/passkey-manager";
import Passkeys from "./controllers/passkeys";
import type { LoginIDConfig } from "./types";
import Utils from "./controllers/utils";
import { applyMixins } from "../utils";
import OTP from "./controllers/otp";
import LoginIDBase from "./base";

interface LoginIDWebSDK extends Passkeys, OTP, PasskeyManager, Utils {}

class LoginIDWebSDK extends LoginIDBase {
  constructor(config: LoginIDConfig) {
    super(config);
  }
}

applyMixins(LoginIDWebSDK, [LoginIDBase, Passkeys, OTP, PasskeyManager, Utils]);

export default LoginIDWebSDK;
