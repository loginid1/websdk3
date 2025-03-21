// Copyright (C) LoginID

export interface CheckoutContext {
  username?: string;
  txPayload: string;
}

export type Flow = "REDIRECT" | "EMBEDDED_CONTEXT";

export interface DiscoverResult {
  username?: string;
  flow: Flow;
}
