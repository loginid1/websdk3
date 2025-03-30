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
import { CheckoutDiscovery, DiscoverStrategy } from "../discovery";
import { createWalletCommunicator } from "../creators";
import { CheckoutIdStore } from "@loginid/core/store";
import { WalletCommunicator } from "../communicators";
import { LoginIDMfa } from "@loginid/core/mfa";

// NOTE: Still WIP
class LoginIDWalletAuth {
  private mfa: LoginIDMfa;
  private discovery: DiscoverStrategy;
  private communicator: WalletCommunicator;
  private checkoutIdStore: CheckoutIdStore;

  constructor(config: LoginIDConfig) {
    this.communicator = createWalletCommunicator();
    this.discovery = new CheckoutDiscovery();
    this.mfa = new LoginIDMfa(config);
    this.checkoutIdStore = new CheckoutIdStore();
  }

  async discover(): Promise<void> {
    const result = await this.discovery.discover();
    this.communicator.sendData("DISCOVER", async () => result);
  }

  async beginFlow(
    options: CheckoutBeginFlowOptions,
  ): Promise<MfaSessionResult> {
    // NOTE: deal with the checkout ID here when we get more
    const checkoutId = this.checkoutIdStore.setOrSignWithCheckoutId();
    console.log(checkoutId);
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
