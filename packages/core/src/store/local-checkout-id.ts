// Copyright (C) LoginID

import { LocalStorageWrapper } from "./local-storage";

const checkoutIdStorageKey = "LoginID_checkout-id";

/**
 * The CheckoutIdLocalStorage class provides static methods to persist and retrieve
 * a checkoud ID associated with a merchant.
 */
export class CheckoutIdLocalStorage extends LocalStorageWrapper {
  public static persistCheckoutId(checkoutId: string): void {
    this.setItem(checkoutIdStorageKey, checkoutId);
  }

  public static getCheckoutId(): string {
    return this.getItem(checkoutIdStorageKey) || "";
  }
}
