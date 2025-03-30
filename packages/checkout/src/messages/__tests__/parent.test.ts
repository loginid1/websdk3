// Copyright (C) LoginID

import { MESSAGES_CHANNEL } from "../constants";
import { MessagesError } from "../../errors";
import { verifyMessage } from "../helpers";
import { ParentMessages } from "../parent";

jest.mock("../helpers", () => ({
  verifyMessage: jest.fn(),
}));

jest.mock("@loginid/core/utils/crypto", () => ({
  randomUUID: jest.fn(() => "mock-uuid"),
}));

jest.useFakeTimers();
jest.spyOn(global, "setInterval");
jest.spyOn(globalThis, "removeEventListener");

describe("ParentMessages", () => {
  let mockPostMessage: jest.Mock;
  let mockIframe: HTMLIFrameElement;
  let parentMessages: ParentMessages;
  const allowedOrigin = "https://wallet.ca";

  beforeEach(() => {
    mockPostMessage = jest.fn();
    mockIframe = {
      contentWindow: {
        postMessage: mockPostMessage,
      },
    } as unknown as HTMLIFrameElement;

    parentMessages = new ParentMessages(mockIframe, allowedOrigin);
    (verifyMessage as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const finalizeHandshake = () => {
    const event = new MessageEvent("message", {
      data: { type: "handshake-response" },
    });
    (parentMessages as any).handleMessage(event);
  };

  it("should initialize and start the handshake process", () => {
    jest.advanceTimersByTime(500);

    expect(mockPostMessage).toHaveBeenCalledWith(
      { channel: MESSAGES_CHANNEL, type: "handshake" },
      { targetOrigin: allowedOrigin },
    );
  });

  it("should stop the handshake interval once handshake is complete", () => {
    const event = new MessageEvent("message", {
      data: { type: "handshake-response" },
    });

    jest.advanceTimersByTime(600);

    (parentMessages as any).handleMessage(event);
    expect((parentMessages as any).isHandshakeComplete).toBe(true);

    jest.advanceTimersByTime(5000);
    expect(mockPostMessage).toHaveBeenCalledTimes(1);
  });

  it("should ignore message if verifyMessage returns false", () => {
    (verifyMessage as jest.Mock).mockReturnValue(false);

    const event = new MessageEvent("message", { data: {} });
    globalThis.dispatchEvent(event);

    expect(verifyMessage).toHaveBeenCalledWith(event, allowedOrigin);
  });

  it("should resolve a pending request when receiving a message-response", async () => {
    finalizeHandshake();

    const responseData = { result: "success" };
    const promise = parentMessages.sendMessage("discover", {
      param: "value",
    });

    await (parentMessages as any).waitForHandshake();

    const event = new MessageEvent("message", {
      data: { id: "mock-uuid", type: "message-response", data: responseData },
    });
    globalThis.dispatchEvent(event);

    await expect(promise).resolves.toEqual(responseData);
    expect(globalThis.removeEventListener).toHaveBeenCalledWith(
      "message",
      expect.any(Function),
    );
  });

  it("should reject a pending request when receiving an error response", async () => {
    finalizeHandshake();

    const errorMessage = "Some error";
    const promise = parentMessages.sendMessage("discover", {
      param: "value",
    });

    await (parentMessages as any).waitForHandshake();

    const event = new MessageEvent("message", {
      data: { id: "mock-uuid", type: "error", data: { message: errorMessage } },
    });
    globalThis.dispatchEvent(event);

    await expect(promise).rejects.toThrow(new MessagesError(errorMessage));
    expect(globalThis.removeEventListener).toHaveBeenCalledWith(
      "message",
      expect.any(Function),
    );
  });

  it("should reject sendMessage if handshake times out", async () => {
    (parentMessages as any).isHandshakeComplete = false;

    const promise = parentMessages.sendMessage("discover", {});

    jest.advanceTimersByTime(310000);

    await expect(promise).rejects.toThrow(
      new MessagesError("Handshake timed out"),
    );
  });

  it("should ignore messages with unknown IDs", () => {
    const event = new MessageEvent("message", {
      data: { id: "unknown-id", type: "message-response", data: {} },
    });

    globalThis.dispatchEvent(event);
    // No assertion needed since the function should just exit without throwing
  });
});
