// Copyright (C) LoginID

import { Reject, Resolve } from "../types";

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
