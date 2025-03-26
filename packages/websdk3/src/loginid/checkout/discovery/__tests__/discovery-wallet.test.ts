// Copyright (C) LoginID

import { TrustStore } from "../../../lib/store/trust-store";
import { CheckoutDiscovery } from "../discovery-wallet";

jest.mock("../../../lib/store/trust-store");

describe("CheckoutDiscovery", () => {
  const mockAppId = "testAppId";
  const username = "testUser";
  let checkoutDiscovery: CheckoutDiscovery;

  beforeEach(() => {
    checkoutDiscovery = new CheckoutDiscovery(mockAppId);
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
    (TrustStore.prototype.getAllTrustIds as jest.Mock).mockResolvedValue([]);
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "REDIRECT" });
  });

  it("should return EMBEDDED_CONTEXT when one trust ID is found", async () => {
    (TrustStore.prototype.getAllTrustIds as jest.Mock).mockResolvedValue([
      { username: "testUser" },
    ]);
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ username: "testUser", flow: "EMBEDDED_CONTEXT" });
  });

  it("should return EMBEDDED_CONTEXT and the first user when more than one trust ID is found", async () => {
    (TrustStore.prototype.getAllTrustIds as jest.Mock).mockResolvedValue([
      { username: "user1" },
      { username: "user2" },
    ]);
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ username: "user1", flow: "EMBEDDED_CONTEXT" });
  });

  it("should return REDIRECT when no trust IDs are found", async () => {
    (TrustStore.prototype.getAllTrustIds as jest.Mock).mockResolvedValue([]);
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "REDIRECT" });
  });
});
