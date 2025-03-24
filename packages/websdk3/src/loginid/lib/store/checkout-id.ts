// Copyright (C) LoginID

import { getCookie, setCookie } from "../../../utils";
import LocalStorageWrapper from "./local-storage";

const key = "loginid_checkout-id";
const cookieKey = "loginid_checkout_id";
/**
 * Utility class to manage the Checkout ID in localStorage.
 */
export class CheckoutIdStore extends LocalStorageWrapper {
  /**
   * Saves the checkout ID to localStorage.
   *
   * @param {string} checkoutId - The checkout ID to be stored.
   */
  public static setCheckoutId(checkoutId: string) {
    this.setItem(key, checkoutId);
  }

  /**
   * Retrieves the checkout ID from localStorage.
   *
   * @returns {string} The stored checkout ID, or an empty string if not found.
   */
  public static getCheckoutId(): string {
    return this.getItem(key) || "";
  }

  public static setCookieCheckoutId(checkoutId: string) {
    const cookie = `${cookieKey}=${checkoutId}; SameSite=None; Secure; Path=/; Max-Age=31536000`;
    setCookie(cookie);
  }

  public static getCookieCheckoutId(): string {
    return getCookie(cookieKey) || "";
  }
}

export default CheckoutIdStore;
