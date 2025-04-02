// Copyright (C) LoginID

/**
 * Parameters for initiating the checkout process using the Merchant SDK.
 *
 * @interface StartCheckoutParams
 */
export interface StartCheckoutParams {
  /**
   * The custom iframe element that will be used to render the embedded checkout flow.
   * Must have appropriate `allow` attributes for WebAuthn (e.g., `publickey-credentials-get` and `publickey-credentials-create`).
   */
  iframe: HTMLIFrameElement;

  /**
   * The HTML element to which the iframe should be mounted.
   * Typically a container in your DOM, such as `document.body`.
   */
  mountTarget: HTMLElement;

  /**
   * Optional URL used for discovery to determine whether an embedded checkout is possible.
   * If omitted, fallback logic will rely on iframe.src.
   */
  discoverUrl?: string;

  /**
   * Callback function invoked if embedded checkout is not possible.
   * Use this to implement a manual fallback flow (e.g., redirect to wallet).
   */
  fallbackCallback: () => Promise<void>;

  /**
   * Optional callback function invoked when an error occurs during checkout.
   * Receives an error string describing the issue.
   */
  errorCallback?: (error: string) => Promise<void>;

  /**
   * Optional callback function invoked when the checkout completes successfully.
   */
  successCallback?: () => Promise<void>;
}

/**
 * Result returned from the embedded context discovery or checkout process.
 *
 * @interface EmbeddedContextResult
 */
export interface EmbeddedContextResult {
  /**
   * Optional error message returned if the embedded context or checkout fails.
   */
  error?: string;
}
