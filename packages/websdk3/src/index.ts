// Copyright (C) LoginID

import {
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable,
} from "./browser";
import {
  createPasskeyCredential,
  getPasskeyCredential,
} from "./loginid/lib/webauthn";
import LoginIDConfigValidator from "./loginid/lib/validators";
import { TrustStore } from "./loginid/lib/store/trust-store";
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
  LoginIDConfigValidator,
  PasskeyError,
  TrustStore,
  WebAuthnHelper,
};
export type { Passkey, PasskeyCollection } from "./api";

export * as LoginIDAPI from "./api";
export * from "./loginid/types";

export default LoginIDWebSDK;
