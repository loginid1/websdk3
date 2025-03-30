// Copyright (C) LoginID

import { AnyAsyncFunction, Reject, Resolve } from "../types";

/**
 * Represents a collection of child methods.
 * @interface
 */
export interface ChildMethods {
  [key: string]: AnyAsyncFunction;
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
 * Represents a pending request.
 * @interface
 */
export interface PendingRequest {
  /**
   * The resolve function for the request.
   * @type {Resolve<any>}
   */
  resolve: Resolve<any>;
  /**
   * The reject function for the request.
   * @type {Reject}
   */
  reject: Reject;
}

/**
 * Represents the method names that can be used in an iframe.
 * @type {string}
 */
export type IframeMethod = "discover" | "sign_transaction";

/**
 * Represents the API for parent messages.
 * @interface
 */
export interface ParentMessagesAPI {
  /**
   * Sends a message to the parent.
   * @param {string} method - The method name to be invoked.
   * @param {any} [params] - Optional parameters for the method.
   * @returns {Promise<any>} A promise that resolves with the response from the parent.
   */
  sendMessage(method: string, params?: any): Promise<any>;
}

/**
 * Represents the API for child messages.
 * @interface
 */
export interface ChildMessagesAPI {
  /**
   * Processes all pending requests.
   * This method resolves or rejects each pending request based on the response received.
   *
   * @returns {Promise<void>} A promise that resolves when all pending requests have been processed.
   */
  processPendingRequests(): Promise<void>;
  /**
   * Adds a method to the collection of child methods.
   * This allows the child to handle specific method calls from the parent.
   *
   * @param {IframeMethod} name - The name of the method to add.
   * @param {AnyAsyncFunction} fn - The function to execute when the method is called.
   */
  addMethod(name: IframeMethod, fn: AnyAsyncFunction): void;
}
