// Copyright (C) LoginID

import { LoginIDConfig, MfaFactorName, MfaSessionResult } from "../../types";
import {
  CheckoutBeginFlowOptions,
  CheckoutPerformActionOptions,
} from "../types";
import { CheckoutDiscovery, DiscoverStrategy } from "../discovery";
import CheckoutIdStore from "../../lib/store/checkout-id";
import LoginIDConfigValidator from "../../lib/validators";
import { createWalletCommunicator } from "../creators";
import { WalletCommunicator } from "../communicators";
import LoginIDMfa from "../../mfa";

// NOTE: Still WIP
class LoginIDWalletAuth {
  private mfa: LoginIDMfa;
  private discovery: DiscoverStrategy;
  private communicator: WalletCommunicator;

  constructor(config: LoginIDConfig) {
    const val = new LoginIDConfigValidator(config);
    this.communicator = createWalletCommunicator();
    this.discovery = new CheckoutDiscovery(val.getAppId());
    this.mfa = new LoginIDMfa(config);
  }

  async discover(): Promise<void> {
    const result = await this.discovery.discover();
    this.communicator.sendData("DISCOVER", async () => result);
  }

  async beginFlow(
    options: CheckoutBeginFlowOptions,
  ): Promise<MfaSessionResult> {
    // NOTE: Do what we need to do before starting the MFA flow
    const username = CheckoutIdStore.getCookieCheckoutId();
    if (!options.username) {
      options.username = username;
    }

    const opts = { txPayload: options.txPayload };
    return await this.mfa.beginFlow(options.username || "", opts);
  }

  async performAction(
    factorName: MfaFactorName,
    options: CheckoutPerformActionOptions = {},
  ): Promise<MfaSessionResult> {
    const result = await this.mfa.performAction(factorName, options);
    // NOTE: Do what we need to do after performing the MFA action

    // Make sure only one trsut ID is stored for checkout
    if ((result.payloadSignature || result.accessToken) && result.username) {
      CheckoutIdStore.setCookieCheckoutId(result.username);

      const callback = async () => ({
        checkoutId: result.username,
      });

      this.communicator.sendData("EMBEDDED_CONTEXT", callback, {
        redirectUrl: options.redirectUrl,
      });
    }

    return result;
  }
}

export default LoginIDWalletAuth;
