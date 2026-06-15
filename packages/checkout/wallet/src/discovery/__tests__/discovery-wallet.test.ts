// Copyright (C) LoginID

import { CheckoutDiscovery } from "../discovery-wallet";
import { TrustStore } from "@loginid/core/store";
import { ApiError } from "@loginid/core/api";

jest.mock("@loginid/core/store");

describe("CheckoutDiscovery", () => {
  let checkoutDiscovery: CheckoutDiscovery;
  const mockTrustStore = {
    getLatestOrCreateTrustId: jest.fn(),
    isTrustIdValid: jest.fn(),
  };

  beforeEach(() => {
    (TrustStore.forCheckout as jest.Mock).mockReturnValue(mockTrustStore);

    checkoutDiscovery = new CheckoutDiscovery({
      baseUrl: "https://api.loginid.io",
    });

    (checkoutDiscovery as any).service = {
      mfa: {
        mfaMfaDiscover: jest.fn(),
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return EMBED when server returns success", async () => {
    mockTrustStore.getLatestOrCreateTrustId.mockResolvedValue("abc123");
    (checkoutDiscovery as any).service.mfa.mfaMfaDiscover.mockResolvedValue({});
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "EMBED", status: "SUCCESS" });
  });

  it("should return REDIRECT when server returns 404", async () => {
    mockTrustStore.getLatestOrCreateTrustId.mockResolvedValue("abc123");

    const error404 = new ApiError(
      { method: "POST", url: "/mfa/discover", body: {} },
      {
        url: "https://api.loginid.io/mfa/discover",
        status: 404,
        statusText: "Not Found",
        body: {},
        ok: false,
      },
      "Not Found",
    );

    (checkoutDiscovery as any).service.mfa.mfaMfaDiscover.mockRejectedValue(
      error404,
    );
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({
      flow: "REDIRECT",
      status: "FAILED",
      reason: "NOT_FOUND",
    });
  });

  it("should fall back to client validation on non-404 errors", async () => {
    mockTrustStore.getLatestOrCreateTrustId.mockResolvedValue("abc123");
    mockTrustStore.isTrustIdValid.mockResolvedValue(null);

    const error500 = new ApiError(
      { method: "POST", url: "/mfa/discover", body: {} },
      {
        url: "https://api.loginid.io/mfa/discover",
        status: 500,
        statusText: "Server Error",
        body: {},
        ok: false,
      },
      "Server Error",
    );

    (checkoutDiscovery as any).service.mfa.mfaMfaDiscover.mockRejectedValue(
      error500,
    );
    let result = await checkoutDiscovery.discover();
    expect(result).toEqual({
      flow: "REDIRECT",
      status: "FAILED",
      reason: "UNKNOWN",
    });

    mockTrustStore.isTrustIdValid.mockResolvedValue("abc123");
    result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "EMBED", status: "SUCCESS" });
  });
});
