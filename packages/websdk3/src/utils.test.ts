// Copyright (C) LoginID

import {
  a2b,
  b2a,
  base64UrlToBuffer,
  bufferToBase64Url,
  generateRandomString,
  randomUUID,
} from "./utils";

describe("a2b", () => {
  it("should decode a simple base64-encoded string", () => {
    const encodedString = "SGVsbG8gV29ybGQh";
    const decodedString = a2b(encodedString);
    expect(decodedString).toBe("Hello World!");
  });

  it("should handle padding characters", () => {
    const encodedString = "SGk=";
    const decodedString = a2b(encodedString);
    expect(decodedString).toBe("Hi");
  });

  it("should handle whitespace characters", () => {
    const encodedString = "SGV sbG 8gV29ybGQh";
    const decodedString = a2b(encodedString);
    expect(decodedString).toBe("Hello World!");
  });

  it("should handle invalid characters", () => {
    const encodedString = "SGVsbG8gV29ybGQh!";
    const decodedString = a2b(encodedString);
    expect(decodedString).toBe("Hello World!");
  });

  it("should decode an empty string", () => {
    const encodedString = "";
    const decodedString = a2b(encodedString);
    expect(decodedString).toBe("");
  });
});

describe("b2a", () => {
  it("should encode a simple string", () => {
    const input = "Hello, World!";
    const encoded = b2a(input);
    expect(encoded).toBe("SGVsbG8sIFdvcmxkIQ==");
  });

  it("should handle an empty string", () => {
    const input = "";
    const encoded = b2a(input);
    expect(encoded).toBe("");
  });

  it("should handle special characters", () => {
    const input = "Special characters: !@#$%^&*()_+";
    const encoded = b2a(input);
    expect(encoded).toBe("U3BlY2lhbCBjaGFyYWN0ZXJzOiAhQCMkJV4mKigpXys=");
  });
});

describe("bufferToBase64Url", () => {
  it("should convert a buffer to base64url", () => {
    // Create a sample ArrayBuffer.
    const buffer = new Uint8Array([72, 101, 108, 108, 111]).buffer; // "Hello" in ASCII

    // Call the bufferToBase64 function with the mocked dependencies.
    const result = bufferToBase64Url(buffer);

    // Expectations
    expect(result).toBe("SGVsbG8"); // Ensure the result matches the expected base64url string.
  });

  it("should handle an empty buffer", () => {
    // Create an empty ArrayBuffer.
    const buffer = new ArrayBuffer(0);

    // Call the bufferToBase64 function with the mocked dependencies.
    const result = bufferToBase64Url(buffer);

    // Expectations
    expect(result).toBe(""); // Ensure the result is an empty string.
  });

  it("should convert a Fido2 rawId buffer to base64url", () => {
    // Create a sample ArrayBuffer.
    const buffer = new Uint8Array([
      187, 106, 173, 124, 221, 133, 51, 143, 84, 212, 28, 114, 228, 123, 6, 24,
      133, 55, 48, 93, 77, 65, 179, 95, 88, 189, 253, 145, 33, 149, 144, 86,
    ]).buffer; // "u2qtfN2FM49U1Bxy5HsGGIU3MF1NQbNfWL39kSGVkFY" in ASCII

    // Call the bufferToBase64 function with the mocked dependencies.
    const result = bufferToBase64Url(buffer);

    // Expectations
    expect(result).toBe("u2qtfN2FM49U1Bxy5HsGGIU3MF1NQbNfWL39kSGVkFY"); // Ensure the result matches the expected base64url string.
  });
});

describe("base64UrlToBuffer", () => {
  it("should convert a base64 URL string to a buffer", () => {
    // Call the base64UrlToBuffer function with the mocked dependencies.
    const result = base64UrlToBuffer("SGVsbG8");

    // Expectations
    expect(result instanceof ArrayBuffer).toBe(true); // Ensure the result is an ArrayBuffer.
    expect(new Uint8Array(result)).toEqual(
      new Uint8Array([72, 101, 108, 108, 111]),
    ); // Ensure the buffer content matches.
  });

  it("should handle an empty input string", () => {
    // Call the base64UrlToBuffer function with the mocked dependencies.
    const result = base64UrlToBuffer("");

    // Expectations
    expect(result instanceof ArrayBuffer).toBe(true); // Ensure the result is an ArrayBuffer.
    expect(result.byteLength).toBe(0); // Ensure the buffer is empty.
  });

  it("should handle a Fido2 challenge", () => {
    // Call the base64UrlToBuffer function with the mocked dependencies.
    const result = base64UrlToBuffer(
      "VaVQKNxmdTAlSoNb25L_ndhnNN6rb7rvZvzqgdAgsiM",
    );

    // Expectations
    expect(result instanceof ArrayBuffer).toBe(true); // Ensure the result is an ArrayBuffer.
    expect(new Uint8Array(result)).toEqual(
      new Uint8Array([
        85, 165, 80, 40, 220, 102, 117, 48, 37, 74, 131, 91, 219, 146, 255, 157,
        216, 103, 52, 222, 171, 111, 186, 239, 102, 252, 234, 129, 208, 32, 178,
        35,
      ]),
    ); // Ensure the buffer content matches.
  });

  it("should handle a Fido2 user ID", () => {
    // Call the base64UrlToBuffer function with the mocked dependencies.
    const result = base64UrlToBuffer("sbKOGhC4p7Hffd_txj9knw");

    // Expectations
    expect(result instanceof ArrayBuffer).toBe(true); // Ensure the result is an ArrayBuffer.
    expect(new Uint8Array(result)).toEqual(
      new Uint8Array([
        177, 178, 142, 26, 16, 184, 167, 177, 223, 125, 223, 237, 198, 63, 100,
        159,
      ]),
    ); // Ensure the buffer content matches.
  });
});

describe("generateRandomString", () => {
  it("should generate a string of the specified length", () => {
    const length = 16;
    const randomString = generateRandomString(length);
    expect(randomString).toHaveLength(length);
  });

  it("should generate a string with default length of 12", () => {
    const randomString = generateRandomString();
    expect(randomString).toHaveLength(12);
  });
});

describe("randomUUID", () => {
  const originalRandomUUID = window.crypto.randomUUID;

  beforeEach(() => {
    Object.defineProperty(window.crypto, "randomUUID", {
      value: originalRandomUUID,
      configurable: true,
    });
  });

  it("should generate a UUID if supported", () => {
    const expected = "123e4567-e89b-12d3-a456-426614174000";
    Object.defineProperty(window.crypto, "randomUUID", {
      value: () => expected,
      configurable: true,
    });

    const uuid = randomUUID();
    expect(uuid).toHaveLength(36);
  });

  it("should generate a random string of length 24 if UUID is not supported", () => {
    const randomString = randomUUID();
    expect(randomString).toHaveLength(24);
  });
});
