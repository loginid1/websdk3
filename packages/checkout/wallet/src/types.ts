// Copyright (C) LoginID

/**
 * Represents any asynchronous function.
 * @param {...any} args - The arguments for the function.
 * @returns {Promise<any>} A promise that resolves to any value.
 */
export type AnyAsyncFunction = (...args: any[]) => Promise<any>;

export type ResultCallback<T, U> = (param: T) => Promise<U>;

export interface CheckoutBeginFlowOptions {
  txPayload: string;

  /**
   * An identifier generated on the merchant side to identify the current checkout session.
   * This identifier is used as a key to retrieve associated trust information.
   *
   * It is passed to the wallet to link the session with wallet-issued identity data,
   * enabling secure transaction confirmation without revealing end-user identity to the merchant.
   */
  checkoutId?: string;
  username?: string;
}

export interface CheckoutPerformActionOptions {
  /**
   * The payload required for completing the authentication factor.
   * This typically contains user input or challenge-response data.
   */
  payload?: string;

  redirectUrl?: string;
}
