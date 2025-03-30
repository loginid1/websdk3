// Copyright (C) LoginID

import { ReceiverType } from "@loginid/checkout-commons";

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
