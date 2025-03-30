// Copyright (C) LoginID

import { WalletCommunicator } from "../communicators/types";
import { WalletToMerchant } from "../communicators";
import { ChildMessages } from "../messages";

export const createWalletCommunicator = (): WalletCommunicator => {
  const childApi = new ChildMessages();
  return new WalletToMerchant(childApi);
};
