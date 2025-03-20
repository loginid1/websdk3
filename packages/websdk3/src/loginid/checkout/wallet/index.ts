// Copyright (C) LoginID

import {
  LoginIDConfig,
  MfaFactorName,
  MfaPerformFactorOptions,
  MfaSessionResult,
} from "../../types";
import { CheckoutDiscovery, DiscoverStrategy } from "../discovery";
import { CheckoutContext, DiscoverResult } from "../types";
import LoginIDConfigValidator from "../../lib/validators";
import LoginIDMfa from "../../mfa";

class LoginIDWalletAuth {
  private mfa: LoginIDMfa;
  private discovery: DiscoverStrategy;

  constructor(config: LoginIDConfig) {
    const appId = new LoginIDConfigValidator(config).getAppId();
    this.mfa = new LoginIDMfa(config);
    this.discovery = new CheckoutDiscovery(appId);
  }

  async discover(): Promise<DiscoverResult> {
    return await this.discovery.discover();
  }

  async beginFlow(context: CheckoutContext): Promise<MfaSessionResult> {
    return await this.mfa.beginFlow(context.username || "");
  }

  async performAction(
    factorName: MfaFactorName,
    options: MfaPerformFactorOptions = {},
  ): Promise<MfaSessionResult> {
    const result = await this.mfa.performAction(factorName, options);
    return result;
  }
}

export default LoginIDWalletAuth;
