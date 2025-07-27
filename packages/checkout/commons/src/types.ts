// Copyright (C) LoginID

/**
 * Represents the communication flow type used during checkout.
 *
 * - `"REDIRECT"`: Indicates that the wallet should be opened in a new tab or window via full-page redirect.
 * - `"EMBED"`: Indicates that the wallet is loaded in an iframe embedded on the merchant's page.
 */
export type Flow = "REDIRECT" | "EMBED";

/**
 * The result of a discovery call from the wallet, used by the merchant to determine
 * how to proceed with the checkout authentication flow.
 *
 * @expand
 */
export interface DiscoverResult {
  /**
   * The username associated with the current wallet session, if known.
   *
   * @type {string | undefined}
   */
  username?: string;

  /**
   * The communication flow recommended by the wallet for proceeding with checkout.
   * This will either be `"REDIRECT"` or `"EMBED"` and informs the merchant how to load the wallet UI.
   *
   * @type {Flow}
   */
  flow: Flow;
}

/**
 * The type of receiver which determines how data is communicated.
 * It can be a specific flow like "REDIRECT" or "EMBED", or a "DISCOVER" operation.
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
 *
 * @expand
 * @type {string}
 */
export type IframeMethod = "discover" | "sign_transaction";

/**
 * Data sent from the merchant to the wallet when initiating an embedded checkout session.
 * This provides the necessary context for the wallet to begin authentication.
 */
export interface EmbeddedContextData {
  /**
   * The unique identifier for the current checkout session, used for tracking and trust-linking.
   */
  checkoutId?: string;
}
