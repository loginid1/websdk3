// Copyright (C) LoginID

import {
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
} from "../index";

const mockedPublicKey = (result = false) => {
  const mocked = {
    isUserVerifyingPlatformAuthenticatorAvailable: jest
      .fn()
      .mockResolvedValue(result),
  };
  Object.defineProperty(window, "PublicKeyCredential", {
    value: mocked,
    writable: true,
    configurable: true,
  });
};

describe("isPlatformAuthenticatorAvailable", () => {
  it("should return false if PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable does not exist", async () => {
    Object.defineProperty(window, "PublicKeyCredential", {
      value: {},
      writable: true,
      configurable: true,
    });
    const result = await isPlatformAuthenticatorAvailable();
    expect(result).toBe(false);
  });

  it("should return false if PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable returns false", async () => {
    mockedPublicKey(false);
    const result = await isPlatformAuthenticatorAvailable();
    expect(result).toBe(false);
  });

  it("should return true if PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable returns true", async () => {
    mockedPublicKey(true);
    const result = await isPlatformAuthenticatorAvailable();
    expect(result).toBe(true);
  });

  it("should return false if PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable throws an error", async () => {
    const mocked = {
      isUserVerifyingPlatformAuthenticatorAvailable: jest
        .fn()
        .mockRejectedValue(new Error("error")),
    };
    Object.defineProperty(window, "PublicKeyCredential", {
      value: mocked,
      writable: true,
      configurable: true,
    });
    const result = await isPlatformAuthenticatorAvailable();
    expect(result).toBe(false);
  });
});

describe("isConditionalUIAvailable", () => {
  const mockedPublicKey = (result = false) => {
    const mocked = {
      isConditionalMediationAvailable: jest.fn().mockResolvedValue(result),
    };
    Object.defineProperty(window, "PublicKeyCredential", {
      value: mocked,
      writable: true,
      configurable: true,
    });
  };

  it("should return false if PublicKeyCredential.isConditionalUIAvailable does not exist", async () => {
    Object.defineProperty(window, "PublicKeyCredential", {
      value: {},
      writable: true,
      configurable: true,
    });
    const result = await isConditionalUIAvailable();
    expect(result).toBe(false);
  });

  it("should return false if PublicKeyCredential.isConditionalUIAvailable returns false", async () => {
    mockedPublicKey(false);
    const result = await isConditionalUIAvailable();
    expect(result).toBe(false);
  });

  it("should return true if PublicKeyCredential.isConditionalUIAvailable returns true", async () => {
    mockedPublicKey(true);
    const result = await isConditionalUIAvailable();
    expect(result).toBe(true);
  });

  it("should return false if PublicKeyCredential.isConditionalUIAvailable throws an error", async () => {
    const mocked = {
      isConditionalMediationAvailable: jest
        .fn()
        .mockRejectedValue(new Error("error")),
    };
    Object.defineProperty(window, "PublicKeyCredential", {
      value: mocked,
      writable: true,
      configurable: true,
    });
    const result = await isConditionalUIAvailable();
    expect(result).toBe(false);
  });
});
