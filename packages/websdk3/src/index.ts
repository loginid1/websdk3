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
import PasskeyError from "./errors/passkey";
import AbortError from "./errors/abort";
import LoginIDWebSDK from "./loginid";

export {
  createPasskeyCredential,
  getPasskeyCredential,
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
  AbortError,
  LoginIDWebSDK,
  PasskeyError,
  WebAuthnHelper,
};
export type { Passkey, PasskeyCollection } from "./api";

export * as LoginIDAPI from "./api";
export * from "./loginid/types";

export default LoginIDWebSDK;
