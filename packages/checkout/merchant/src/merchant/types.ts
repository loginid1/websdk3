// Copyright (C) LoginID

export interface StartCheckoutParams {
  txPayload: string;
  iframe: HTMLIFrameElement;
  mountTarget: HTMLElement;
  fallbackCallback: () => Promise<void>;
  errorCallback?: (error: string) => Promise<void>;
  successCallback?: (checkoutContext: string) => Promise<void>;
}

export interface EmbeddedContextResult {
  checkoutCookie?: string;
  error?: string;
}
