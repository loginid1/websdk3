// Copyright (C) LoginID

import CheckoutIdStore from "../../../lib/store/checkout-id.ts";
import { CheckoutDiscovery } from "../discovery-wallet";

jest.mock("../../../lib/store/checkout-id.ts", () => ({
  __esModule: true,
  default: {
    setCheckoutId: jest.fn(),
    getCheckoutId: jest.fn(),
    setCookieCheckoutId: jest.fn(),
    getCookieCheckoutId: jest.fn(),
  },
}));

describe("CheckoutDiscovery", () => {
  const username = "testUser";
  let checkoutDiscovery: CheckoutDiscovery;

  beforeEach(() => {
    checkoutDiscovery = new CheckoutDiscovery();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return EMBEDDED_CONTEXT when username is provided", async () => {
    const result = await checkoutDiscovery.discover(username);
    expect(result).toEqual({
      username: username,
      flow: "EMBEDDED_CONTEXT",
    });
  });

  it("should return REDIRECT when username is not provided and no trust ID is found", async () => {
    (CheckoutIdStore.getCookieCheckoutId as jest.Mock).mockReturnValue(
      undefined,
    );
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "REDIRECT" });
  });

  it("should return EMBEDDED_CONTEXT when one trust ID is found", async () => {
    (CheckoutIdStore.getCookieCheckoutId as jest.Mock).mockReturnValue(
      "abc123",
    );
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ username: "abc123", flow: "EMBEDDED_CONTEXT" });
  });
});
