// Copyright (C) LoginID

import { CheckoutDiscovery } from "../discovery-wallet";
import { CheckoutIdStore } from "@loginid/core/store";

jest.mock("@loginid/core/store");

describe("CheckoutDiscovery", () => {
  let checkoutDiscovery: CheckoutDiscovery;

  beforeEach(() => {
    checkoutDiscovery = new CheckoutDiscovery();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return EMBEDDED_CONTEXT when wallet trust ID is found", async () => {
    (CheckoutIdStore.prototype.getCheckoutId as jest.Mock).mockResolvedValue(
      "abc123",
    );
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "EMBEDDED_CONTEXT" });
  });

  it("should return REDIRECT when there is no wallet trust ID", async () => {
    (CheckoutIdStore.prototype.getCheckoutId as jest.Mock).mockResolvedValue(
      null,
    );
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "REDIRECT" });
  });
});
