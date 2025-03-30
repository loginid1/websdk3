// Copyright (C) LoginID

export type Flow = "REDIRECT" | "EMBEDDED_CONTEXT";

export interface DiscoverResult {
  username?: string;
  flow: Flow;
}

/**
 * The type of receiver which determines how data is communicated.
 * It can be a specific flow like "REDIRECT" or "EMBEDDED_CONTEXT", or a "DISCOVER" operation.
 */
export type ReceiverType = Flow | "DISCOVER";

/**
 * Interface for defining a strategy to discover user and authentication contexts.
 */
export interface DiscoverStrategy {
  /**
   * Discovers the appropriate checkout context based on the provided encrypted context.
   * @param {string} [username] - An optional username.
   * @returns {Promise<DiscoverResult>} A promise that resolves to the discovered result.
   */
  discover(username?: string): Promise<DiscoverResult>;
}

/**
 * Represents the types of message data.
 */
export type MessageDataType =
  | "handshake"
  | "handshake-response"
  | "message"
  | "message-response"
  | "error";

/**
 * Represents the structure of message data.
 * @interface
 */
export interface MessageData {
  /**
   * The channel of the message.
   * @type {string}
   */
  channel: string;
  /**
   * The unique identifier of the message.
   * @type {string}
   */
  id: string;
  /**
   * The type of the message.
   * @type {MessageDataType}
   */
  type: MessageDataType;
  /**
   * The method name, if applicable.
   * @type {string}
   */
  method?: string;
  /**
   * The parameters for the method, if applicable.
   * @type {any}
   */
  params?: any;
  /**
   * The data of the message, if applicable.
   * @type {any}
   */
  data?: any;
}

/**
 * Represents the method names that can be used in an iframe.
 * @type {string}
 */
export type IframeMethod = "discover" | "sign_transaction";

export interface EmbeddedContextData {
  txPayload: string;
  username?: string;
  checkoutId?: string;
}
