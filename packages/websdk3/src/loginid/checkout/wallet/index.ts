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
import { TrustStore } from "../../lib/store/trust-store";
import LoginIDMfa from "../../mfa";

// NOTE: Still WIP
class LoginIDWalletAuth {
  private mfa: LoginIDMfa;
  private discovery: DiscoverStrategy;
  private trustStore: TrustStore;

  constructor(config: LoginIDConfig) {
    const appId = new LoginIDConfigValidator(config).getAppId();
    this.discovery = new CheckoutDiscovery(appId);
    this.trustStore = new TrustStore(appId);
    this.mfa = new LoginIDMfa(config);
  }

  async discover(): Promise<DiscoverResult> {
    return await this.discovery.discover();
  }

  async beginFlow(context: CheckoutContext): Promise<MfaSessionResult> {
    // NOTE: Do what we need to do before starting the MFA flow
    const options = { txPayload: context.txPayload };
    return await this.mfa.beginFlow(context.username || "", options);
  }

  async performAction(
    factorName: MfaFactorName,
    options: MfaPerformFactorOptions = {},
  ): Promise<MfaSessionResult> {
    const result = await this.mfa.performAction(factorName, options);
    // NOTE: Do what we need to do after performing the MFA action

    // Make sure only one trsut ID is stored for checkout
    if (result.payloadSignature && result.username) {
      this.trustStore.deleteAllExcept(result.username);
    }

    return result;
  }
}

export default LoginIDWalletAuth;
