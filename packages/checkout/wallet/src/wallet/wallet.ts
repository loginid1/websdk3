// Copyright (C) LoginID

import {
  LoginIDConfig,
  MfaFactorName,
  MfaSessionResult,
} from "@loginid/core/controllers";
import {
  CheckoutBeginFlowOptions,
  CheckoutPerformActionOptions,
} from "../types";
import { DiscoverResult } from "@loginid/checkout-commons";
import { createWalletCommunicator } from "../creators";
import { WalletCommunicator } from "../communicators";
import { CheckoutDiscovery } from "../discovery";
import { LoginIDMfa } from "@loginid/core/mfa";

// NOTE: Still WIP
class LoginIDWalletAuth {
  private mfa: LoginIDMfa;
  private communicator: WalletCommunicator;

  constructor(config: LoginIDConfig) {
    this.communicator = createWalletCommunicator();
    this.mfa = new LoginIDMfa(config);
  }

  async discover(): Promise<DiscoverResult> {
    const discovery = new CheckoutDiscovery();
    const result = await discovery.discover();
    this.communicator.sendData("DISCOVER", async () => result);
    return result;
  }

  async beginFlow(
    options: CheckoutBeginFlowOptions,
  ): Promise<MfaSessionResult> {
    const opts = {
      checkoutId: options.checkoutId,
      txPayload: options.txPayload,
    };
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
      const callback = async () => ({
        checkoutCookie: result.username,
      });

      this.communicator.sendData("EMBEDDED_CONTEXT", callback, {
        redirectUrl: options.redirectUrl,
      });
    }

    return result;
  }
}

export default LoginIDWalletAuth;
