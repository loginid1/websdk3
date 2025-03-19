// Copyright (C) LoginID

import type { LoginIDConfig } from "./types";
import Utils from "./controllers/utils";
import { applyMixins } from "../utils";
import MFA from "./controllers/mfa";
import LoginIDBase from "./base";

interface LoginIDMfa extends MFA, Utils {}

class LoginIDMfa extends LoginIDBase {
  constructor(config: LoginIDConfig) {
    super(config);
  }
}

applyMixins(LoginIDMfa, [LoginIDBase, MFA, Utils]);

export default LoginIDMfa;
