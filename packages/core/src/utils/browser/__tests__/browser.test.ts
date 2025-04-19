// Copyright (C) LoginID

import {
  getClientCapabilities,
  isBluetoothAvailable,
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
} from "../index";

import * as IndexModule from "../index";

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

describe("getClientCapabilities", () => {
  const originalPublicKeyCredential = window.PublicKeyCredential;

  afterEach(() => {
    // Restore the original after each test
    Object.defineProperty(window, "PublicKeyCredential", {
      value: originalPublicKeyCredential,
      configurable: true,
      writable: true,
    });
    jest.restoreAllMocks();
  });

  it("should return empty object if PublicKeyCredential does not exist", async () => {
    Object.defineProperty(window, "PublicKeyCredential", {
      value: undefined,
      configurable: true,
    });

    const result = await getClientCapabilities();
    expect(result).toEqual({});
  });

  it("should return fallback capabilities if getClientCapabilities is not defined", async () => {
    Object.defineProperty(window, "PublicKeyCredential", {
      value: {} as any,
      configurable: true,
    });

    const mockIuvpaa = jest
      .spyOn(IndexModule, "isPlatformAuthenticatorAvailable")
      .mockResolvedValue(true);

    const mockIcma = jest
      .spyOn(IndexModule, "isConditionalUIAvailable")
      .mockResolvedValue(false);

    const result = await getClientCapabilities();
    expect(result).toEqual({
      userVerifyingPlatformAuthenticator: true,
      conditionalGet: false,
    });
    expect(mockIuvpaa).toHaveBeenCalled();
    expect(mockIcma).toHaveBeenCalled();
  });

  it("should return result from getClientCapabilities if defined", async () => {
    const mockCapabilities = {
      userVerifyingPlatformAuthenticator: true,
      conditionalGet: true,
    };

    Object.defineProperty(window, "PublicKeyCredential", {
      value: {
        getClientCapabilities: jest.fn().mockResolvedValue(mockCapabilities),
      } as any,
      configurable: true,
    });

    const result = await getClientCapabilities();
    expect(result).toEqual(mockCapabilities);
  });

  it("should return empty object if an error occurs", async () => {
    Object.defineProperty(window, "PublicKeyCredential", {
      value: {
        getClientCapabilities: jest.fn().mockRejectedValue(new Error("fail")),
      } as any,
      configurable: true,
    });

    const result = await getClientCapabilities();
    expect(result).toEqual({});
  });
});

describe("isBluetoothAvailable", () => {
  //@ts-expect-error: Not found in offical TypeScript types
  const originalNavigatorBluetooth = navigator.bluetooth;

  afterEach(() => {
    // Restore the original navigator.bluetooth after each test
    Object.defineProperty(navigator, "bluetooth", {
      value: originalNavigatorBluetooth,
      configurable: true,
      writable: true,
    });
    jest.restoreAllMocks();
  });

  it("should return false if navigator.bluetooth does not exist", async () => {
    Object.defineProperty(navigator, "bluetooth", {
      value: undefined,
      configurable: true,
    });

    const result = await isBluetoothAvailable();
    expect(result).toBe(false);
  });

  it("should return true if getAvailability resolves true", async () => {
    Object.defineProperty(navigator, "bluetooth", {
      value: {
        getAvailability: jest.fn().mockResolvedValue(true),
      } as any,
      configurable: true,
    });

    const result = await isBluetoothAvailable();
    expect(result).toBe(true);
  });

  it("should return false if getAvailability resolves false", async () => {
    Object.defineProperty(navigator, "bluetooth", {
      value: {
        getAvailability: jest.fn().mockResolvedValue(false),
      } as any,
      configurable: true,
    });

    const result = await isBluetoothAvailable();
    expect(result).toBe(false);
  });

  it("should return false if getAvailability throws", async () => {
    Object.defineProperty(navigator, "bluetooth", {
      value: {
        getAvailability: jest.fn().mockRejectedValue(new Error("fail")),
      } as any,
      configurable: true,
    });

    const result = await isBluetoothAvailable();
    expect(result).toBe(false);
  });
});
