// Copyright (C) LoginID

import { WalletTrustIdStore } from "@loginid/core/store";
import { CheckoutDiscovery } from "../discovery-wallet";
import { ApiError } from "@loginid/core/api";

jest.mock("@loginid/core/store");

describe("CheckoutDiscovery", () => {
  let checkoutDiscovery: CheckoutDiscovery;

  beforeEach(() => {
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
    (
      WalletTrustIdStore.prototype.isCheckoutIdValid as jest.Mock
    ).mockResolvedValue("abc123");
    (checkoutDiscovery as any).service.mfa.mfaMfaDiscover.mockResolvedValue({});
    const result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "EMBED" });
  });

  it("should return REDIRECT when server returns 404", async () => {
    (
      WalletTrustIdStore.prototype.isCheckoutIdValid as jest.Mock
    ).mockResolvedValue(null);

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
    expect(result).toEqual({ flow: "REDIRECT" });
  });

  it("should fall back to client validation on non-404 errors", async () => {
    (
      WalletTrustIdStore.prototype.isCheckoutIdValid as jest.Mock
    ).mockResolvedValue(null);

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
    expect(result).toEqual({ flow: "REDIRECT" });

    (
      WalletTrustIdStore.prototype.isCheckoutIdValid as jest.Mock
    ).mockResolvedValue("abc123");
    result = await checkoutDiscovery.discover();
    expect(result).toEqual({ flow: "EMBED" });
  });
});
