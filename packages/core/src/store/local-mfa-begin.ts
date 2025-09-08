// Copyright (C) LoginID

import { LocalStorageWrapper } from "./local-storage";

const checkoutIdStorageKey = "LoginID_checkout-id";
const traceIdStorageKey = "LoginID_trace-id";

/**
 * MfaBeginLocalStorage provides static methods to persist and retrieve
 * identifiers related to a single MFA interaction session.
 */
export class MfaBeginLocalStorage extends LocalStorageWrapper {
  public static persistCheckoutId(checkoutId: string): void {
    this.setItem(checkoutIdStorageKey, checkoutId);
  }

  public static getCheckoutId(): string {
    return this.getItem(checkoutIdStorageKey) || "";
  }

  public static persistTraceId(traceId: string): void {
    this.setItem(traceIdStorageKey, traceId);
  }

  public static getTraceId(): string {
    return this.getItem(traceIdStorageKey) || "";
  }
}
