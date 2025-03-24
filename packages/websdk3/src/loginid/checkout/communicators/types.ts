// Copyright (C) LoginID

import { Flow, ResultCallback } from "../types";

/**
 * The type of receiver which determines how data is communicated.
 * It can be a specific flow like "REDIRECT" or "EMBEDDED_CONTEXT", or a "DISCOVER" operation.
 */
export type ReceiverType = Flow | "DISCOVER";

/**
 * Interface for a communicator used by the merchant to receive data
 * from different flows or discovery operations.
 */
export interface MerchantCommunicator {
  /**
   * Receives data of a specific type based on the selected communication flow.
   *
   * @template T - The type of the optional payload provided to the receive function.
   * @template U - The type of the data expected in the response.
   * @param {ReceiverType} type - Specifies the communication flow or operation (e.g., "REDIRECT", "DISCOVER").
   * @param {T} [payload] - Optional data to be passed with the receive request.
   * @returns {Promise<U>} A promise that resolves with the received data of type U.
   */
  receiveData<T, U>(type: ReceiverType, payload?: T): Promise<U>;
}

/**
 * Interface for a communicator used by the wallet to wait for a request and send a response.
 */
export interface WalletCommunicator {
  /**
   * Registers a callback to handle incoming data of a specific type and send a response.
   *
   * @template T - The type of the incoming request data.
   * @template U - The type of the response data to be sent back.
   * @param {ReceiverType} type - Specifies the communication flow or operation (e.g., "REDIRECT", "DISCOVER").
   * @param {ResultCallback<T, U>} callback - A function that processes the received data and returns a result.
   * This function is invoked when a request of the specified type is received.
   */
  sendData<T, U>(type: ReceiverType, callback: ResultCallback<T, U>): void;
}
