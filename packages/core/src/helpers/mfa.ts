// Copyright (C) LoginID

import { MfaNext } from "../api";

const MERCHANT_TRUST_ID = "merchantTrustID";
const WALLET_TRUST_ID = "walletTrustID";

/**
 * Finds trust tokens from an MFA `next` action.
 *
 * @param {MfaNext} mfaNextResult - The result from an MFA authentication step.
 */
export const findTrustTokens = (mfaNextResult: MfaNext) => {
  const passkeyAction = mfaNextResult.next?.find((action) =>
    action.action.name.startsWith("passkey:"),
  );

  if (!passkeyAction?.options) {
    return;
  }

  const merchantTrustId = passkeyAction.options.find(
    (option) => option.name === MERCHANT_TRUST_ID,
  )?.value;

  const walletTrustId = passkeyAction.options.find(
    (option) => option.name === WALLET_TRUST_ID,
  )?.value;

  return { merchantTrustId, walletTrustId };
};
