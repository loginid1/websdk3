// Copyright (C) LoginID

import {
  createPasskeyCredential,
  getPasskeyCredential,
} from "./loginid/lib/webauthn";
import {
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
} from "./browser";
import { WebAuthnHelper } from "./webauthn/webauthn-helper";
import { LoginIDWalletAuth } from "./loginid/checkout";
import PasskeyError from "./errors/passkey";
import AbortError from "./errors/abort";
import LoginIDMfa from "./loginid/mfa";
import LoginIDWebSDK from "./loginid";

export {
  createPasskeyCredential,
  getPasskeyCredential,
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
  AbortError,
  LoginIDMfa,
  LoginIDWebSDK,
  LoginIDWalletAuth,
  PasskeyError,
  WebAuthnHelper,
};
export type { Passkey, PasskeyCollection } from "./api";

export * as LoginIDAPI from "./api";
export * from "./loginid/types";
export * from "./loginid/checkout/types";

export default LoginIDWebSDK;
