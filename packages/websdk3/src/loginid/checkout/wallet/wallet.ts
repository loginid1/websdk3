// Copyright (C) LoginID

import {
  LoginIDConfig,
  MfaFactorName,
  MfaPerformActionOptions,
  MfaSessionResult,
} from "../../types";
import { CheckoutDiscovery, DiscoverStrategy } from "../discovery";
import CheckoutIdStore from "../../lib/store/checkout-id";
import { createWalletCommunicator } from "../creators";
import { WalletCommunicator } from "../communicators";
import { CheckoutContext } from "../types";
import LoginIDMfa from "../../mfa";

// NOTE: Still WIP
class LoginIDWalletAuth {
  private mfa: LoginIDMfa;
  private discovery: DiscoverStrategy;
  private communicator: WalletCommunicator;

  constructor(config: LoginIDConfig) {
    this.communicator = createWalletCommunicator();
    this.discovery = new CheckoutDiscovery();
    this.mfa = new LoginIDMfa(config);
  }

  async discover(): Promise<void> {
    const result = await this.discovery.discover();
    this.communicator.sendData("DISCOVER", async () => result);
  }

  async beginFlow(context: CheckoutContext): Promise<MfaSessionResult> {
    // NOTE: Do what we need to do before starting the MFA flow
    const username = CheckoutIdStore.getCookieCheckoutId();
    if (!context.username) {
      context.username = username;
    }

    const options = { txPayload: context.txPayload };
    return await this.mfa.beginFlow(context.username || "", options);
  }

  async performAction(
    factorName: MfaFactorName,
    options: MfaPerformActionOptions = {},
  ): Promise<MfaSessionResult> {
    const result = await this.mfa.performAction(factorName, options);
    // NOTE: Do what we need to do after performing the MFA action

    // Make sure only one trsut ID is stored for checkout
    if ((result.payloadSignature || result.accessToken) && result.username) {
      CheckoutIdStore.setCookieCheckoutId(result.username);
      this.communicator.sendData("EMBEDDED_CONTEXT", async () => ({
        checkoutId: result.username,
      }));
    }

    return result;
  }
}

export default LoginIDWalletAuth;
