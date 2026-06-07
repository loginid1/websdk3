// Copyright (C) LoginID

import { LocalStorageWrapper } from "./local-storage";
import { LoginIDTrustSet } from "../types";

const checkoutIdStorageKey = "LoginID_checkout-id";
const traceIdStorageKey = "LoginID_trace-id";
const trustSetStorageKey = "LoginID_trust-set";

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

  public static persistTrustSet(trustSet?: LoginIDTrustSet): void {
    this.setItem(trustSetStorageKey, trustSet);
  }

  public static getTrustSet(): LoginIDTrustSet | undefined {
    return this.getItem(trustSetStorageKey) || undefined;
  }

  public static clearAll(): void {
    localStorage.removeItem(checkoutIdStorageKey);
    localStorage.removeItem(traceIdStorageKey);
    localStorage.removeItem(trustSetStorageKey);
  }
}
