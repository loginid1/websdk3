// Copyright (C) LoginID

import {
  IframeMethod,
  MessageData,
  ParentMessagesAPI,
  PendingRequest,
} from "./types";
import { MessagesError } from "../../../errors/messages";
import { MESSAGES_CHANNEL } from "./constants";
import { randomUUID } from "../../../utils";
import { verifyMessage } from "./helpers";

/**
 * Class representing parent message handling.
 */
export class ParentMessages implements ParentMessagesAPI {
  /**
   * The allowed origin for message communication.
   * @private
   * @readonly
   * @type {string}
   */
  private readonly allowedOrigin: string;
  /**
   * The iframe element for message communication.
   * @private
   * @readonly
   * @type {HTMLIFrameElement}
   */
  private readonly iframe: HTMLIFrameElement;
  /**
   * Indicates if the handshake is complete.
   * @private
   * @type {boolean}
   */
  private isHandshakeComplete: boolean = false;
  /**
   * The map of pending requests.
   * @private
   * @readonly
   * @type {Map<string, PendingRequest>}
   */
  private readonly pendingRequests: Map<string, PendingRequest> = new Map();

  /**
   * Creates an instance of ParentMessages.
   * @param {HTMLIFrameElement} iframe - The iframe element for message communication.
   * @param {string} [allowedOrigin="*"] - The allowed origin for message communication.
   */
  constructor(iframe: HTMLIFrameElement, allowedOrigin: string = "*") {
    this.iframe = iframe;
    this.allowedOrigin = allowedOrigin;

    this.handleMessage = this.handleMessage.bind(this);
    window.addEventListener("message", this.handleMessage.bind(this));

    this.initHandshake();
  }

  /**
   * Initializes the handshake process.
   * @private
   */
  private initHandshake() {
    const interval = setInterval(() => {
      if (this.isHandshakeComplete) {
        clearInterval(interval);
        return;
      }

      const data = {
        channel: MESSAGES_CHANNEL,
        type: "handshake",
      } as MessageData;

      this.iframe.contentWindow?.postMessage(data, {
        targetOrigin: this.allowedOrigin,
      });
    }, 500);
  }

  /**
   * Handles incoming messages.
   * @private
   * @param {MessageEvent} event - The message event.
   */
  private handleMessage(event: MessageEvent) {
    if (!verifyMessage(event, this.allowedOrigin)) return;
    const { data, id, type } = event.data as MessageData;

    if (type === "handshake-response") {
      this.isHandshakeComplete = true;
      return;
    }

    if (this.pendingRequests.has(id)) {
      const { resolve, reject } = this.pendingRequests.get(id)!;

      if (type === "message-response") {
        resolve(data);
      }

      if (type === "error") {
        reject(new MessagesError(data.message || "Unknown error"));
      }

      // Might want to remove this line if needed for multiple requests
      if (type === "message-response" || type === "error") {
        window.removeEventListener("message", this.handleMessage);
      }
    }
  }

  /**
   * Waits indefinitely for the handshake to complete.
   * @private
   */
  private async waitForHandshake(): Promise<void> {
    const timeout = 300000;
    const interval = 200;
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const checkHandshake = () => {
        if (this.isHandshakeComplete) {
          resolve();
          return;
        }
        if (Date.now() - startTime >= timeout) {
          reject(new MessagesError("Handshake timed out"));
          return;
        }
        setTimeout(checkHandshake, interval);
      };
      checkHandshake();
    });
  }

  /**
   * Sends a message to the child.
   * @param {string} method - The method name.
   * @param {any} [params={}] - The parameters for the method.
   */
  public async sendMessage(method: IframeMethod, params: any = {}) {
    await this.waitForHandshake();

    return new Promise((resolve, reject) => {
      const id = randomUUID();
      this.pendingRequests.set(id, { resolve, reject });

      const data = {
        id,
        channel: MESSAGES_CHANNEL,
        method,
        params,
        type: "message",
      } as MessageData;

      this.iframe.contentWindow?.postMessage(data, {
        targetOrigin: this.allowedOrigin,
      });
    });
  }
}
