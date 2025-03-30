// Copyright (C) LoginID

export interface StartCheckoutParams {
  txPayload: string;
  iframe: HTMLIFrameElement;
  mountTarget: HTMLElement;
  fallbackCallback: () => Promise<void>;
  errorCallback?: (error: string) => Promise<void>;
  successCallback?: (checkoutId: string) => Promise<void>;
}

export interface EmbeddedContextData {
  txPayload: string;
  username?: string;
}

export interface EmbeddedContextResult {
  checkoutId?: string;
  error?: string;
}
