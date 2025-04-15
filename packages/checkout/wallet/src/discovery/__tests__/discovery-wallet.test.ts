// Copyright (C) LoginID

import { WalletTrustIdStore } from "@loginid/core/store";
import { CheckoutDiscovery } from "../discovery-wallet";

jest.mock("@loginid/core/store");

describe("CheckoutDiscovery", () => {
  let checkoutDiscovery: CheckoutDiscovery;

  beforeEach(() => {
    checkoutDiscovery = new CheckoutDiscovery();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return EMBEDDED_CONTEXT when wallet trust ID is valid", async () => {
    (
      WalletTrustIdStore.prototype.isCheckoutIdValid as jest.Mock
    ).mockResolvedValue("abc123");
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "EMBEDDED_CONTEXT" });
  });

  it("should return REDIRECT when there is no valid wallet trust ID", async () => {
    (
      WalletTrustIdStore.prototype.isCheckoutIdValid as jest.Mock
    ).mockResolvedValue(null);
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "REDIRECT" });
  });
});
