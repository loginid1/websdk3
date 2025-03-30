// Copyright (C) LoginID

import { MESSAGES_CHANNEL } from "../constants";
import { verifyMessage } from "../helpers";
import { ChildMessages } from "../child";

jest.mock("../helpers", () => ({
  verifyMessage: jest.fn(),
}));

describe("ChildMessages", () => {
  let mockPostMessage: jest.Mock;
  let childMessages: ChildMessages;
  const allowedOrigin = "https://merchant.ca";

  beforeEach(() => {
    mockPostMessage = jest.fn();
    childMessages = new ChildMessages(allowedOrigin);
    (verifyMessage as jest.Mock).mockReturnValue(true);
  });

  it("should process pending requests", async () => {
    (childMessages as any).isHandshakeComplete = true;

    const mockFn = jest.fn().mockResolvedValue({ data: "success" });
    childMessages.addMethod("discover", mockFn);

    const event1 = new MessageEvent("message", {
      data: { id: "123", method: "discover", params: { foo: "bar1" } },
      source: { postMessage: mockPostMessage } as any,
    });

    const event2 = new MessageEvent("message", {
      data: { id: "456", method: "discover", params: { foo: "bar2" } },
      source: { postMessage: mockPostMessage } as any,
    });

    (childMessages as any).pendingRequests.push(event1, event2);

    await childMessages.processPendingRequests();

    expect(mockFn).toHaveBeenCalledWith({ foo: "bar1" });
    expect(mockFn).toHaveBeenCalledWith({ foo: "bar2" });
    expect(mockPostMessage).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add a method correctly", () => {
    const mockFn = jest.fn();
    const method = "discover";
    childMessages.addMethod(method, mockFn);
    expect((childMessages as any).methods[method]).toBe(mockFn);
  });

  it("should ignore message if verifyMessage returns false", () => {
    (verifyMessage as jest.Mock).mockReturnValue(false);

    const event = new MessageEvent("message", { data: {} });
    (childMessages as any).handleMessage(event);

    expect(verifyMessage).toHaveBeenCalledWith(event, allowedOrigin);
    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it("should complete handshake on handshake message", () => {
    const event = new MessageEvent("message", {
      data: { id: "123", type: "handshake" },
      source: { postMessage: mockPostMessage } as any,
    });

    (childMessages as any).handleMessage(event);

    expect(mockPostMessage).toHaveBeenCalledWith(
      { id: "123", channel: MESSAGES_CHANNEL, type: "handshake-response" },
      { targetOrigin: allowedOrigin },
    );
    expect((childMessages as any).isHandshakeComplete).toBe(true);
  });

  it("should ignore messages if handshake is not complete", () => {
    const event = new MessageEvent("message", {
      data: { method: "someMethod", params: {} },
      source: { postMessage: mockPostMessage } as any,
    });

    (childMessages as any).handleMessage(event);
    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it("should ignore messages if no method is provided", () => {
    (childMessages as any).isHandshakeComplete = true;

    const event = new MessageEvent("message", {
      data: { id: "123", params: {} },
      source: { postMessage: mockPostMessage } as any,
    });

    (childMessages as any).handleMessage(event);
    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it("should call the registered method and respond with the result", async () => {
    (childMessages as any).isHandshakeComplete = true;

    const mockFn = jest.fn().mockResolvedValue({ data: "success" });
    childMessages.addMethod("discover", mockFn);

    const event = new MessageEvent("message", {
      data: { id: "123", method: "discover", params: { foo: "bar" } },
      source: { postMessage: mockPostMessage } as any,
    });

    await (childMessages as any).handleMessage(event);

    expect(mockFn).toHaveBeenCalledWith({ foo: "bar" });
    expect(mockPostMessage).toHaveBeenCalledWith(
      {
        id: "123",
        channel: MESSAGES_CHANNEL,
        type: "message-response",
        data: { data: "success" },
      },
      { targetOrigin: allowedOrigin },
    );
  });

  it("should add message to pendingRequests if method is not registered", () => {
    (childMessages as any).isHandshakeComplete = true;

    const event = new MessageEvent("message", {
      data: { id: "789", method: "unregisteredMethod", params: {} },
      source: { postMessage: mockPostMessage } as any,
    });

    (childMessages as any).handleMessage(event);

    expect((childMessages as any).pendingRequests.length).toBe(1);
    expect((childMessages as any).pendingRequests[0].data.method).toBe(
      "unregisteredMethod",
    );
  });

  it("should respond with an error message if the method throws an error", async () => {
    (childMessages as any).isHandshakeComplete = true;

    const mockFn = jest.fn().mockRejectedValue(new Error("error"));
    childMessages.addMethod("discover", mockFn);

    const event = new MessageEvent("message", {
      data: { id: "123", method: "discover", params: {} },
      source: { postMessage: mockPostMessage } as any,
    });

    await (childMessages as any).handleMessage(event);

    expect(mockPostMessage).toHaveBeenCalledWith(
      {
        id: "123",
        channel: MESSAGES_CHANNEL,
        type: "error",
        data: { message: "error" },
      },
      { targetOrigin: allowedOrigin },
    );
  });
});
