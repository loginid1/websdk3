// Copyright (C) LoginID

import { MESSAGES_CHANNEL } from "../constants";
import { verifyMessage } from "../helpers";

describe("verifyMessage", () => {
  const origin = "https://example.com";
  const validEvent = {
    origin,
    data: { channel: MESSAGES_CHANNEL },
  } as MessageEvent;

  it("should return true for valid message event", () => {
    expect(verifyMessage(validEvent, origin)).toBe(true);
  });

  it("should return true for valid message event with wild card", () => {
    expect(verifyMessage(validEvent, "*")).toBe(true);
  });

  it("should return false if event origin does not match", () => {
    const invalidOriginEvent = { ...validEvent, origin: "https://invalid.com" };
    expect(verifyMessage(invalidOriginEvent, origin)).toBe(false);
  });

  it("should return false if event data is null", () => {
    const nullDataEvent = { ...validEvent, data: null };
    expect(verifyMessage(nullDataEvent, origin)).toBe(false);
  });

  it("should return false if event data channel is incorrect", () => {
    const invalidChannelEvent = {
      ...validEvent,
      data: { channel: "INVALID_CHANNEL" },
    };
    expect(verifyMessage(invalidChannelEvent, origin)).toBe(false);
  });
});
