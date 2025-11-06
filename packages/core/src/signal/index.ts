// Copyright (C) LoginID

import {
  signalAllAcceptedCredentials,
  signalUnknownCredential,
} from "../utils/browser";
import { LoginIDService, PasskeyCollection } from "../api";
import { SessionManager } from "../session";
import { Logger } from "../utils/logger";

/**
 * Fetches the current list of registered passkeys from the relying party (RP)
 * and synchronizes them with the authenticator.
 *
 * @param {LoginIDService} service - The API service used to fetch the list of registered passkeys.
 * @param {SessionManager} session - The session manager providing the current RP and user context.
 * @returns {Promise<void>} A promise that resolves once the passkeys have been fetched and synchronized.
 */
export const fetchAndSyncPasskeys = async (
  service: LoginIDService,
  session: SessionManager,
): Promise<void> => {
  try {
    const sessionInfo = session.getSessionInfo();
    if (!sessionInfo) {
      Logger.logger.debug("No session info available for syncing passkeys.");
      return;
    }

    const token = session.getToken({});
    const passkeys = await service.passkeys.passkeysPasskeysList({
      authorization: token,
    });
    await syncPasskeysWithAuthenticator(passkeys, session);
  } catch (error) {
    Logger.logger.debug(`Error fetching and syncing passkeys: ${error}`);
  }
};

/**
 * This function sends a signal to the authenticator listing all credential IDs
 * that are still recognized by the relying party (RP). This allows the
 * authenticator to remove any credentials that are no longer valid, keeping
 * it consistent with the server state.
 *
 * @param {PasskeyCollection} passkeys - The list of passkeys currently known to the RP.
 * @param {SessionManager} session - The active session manager used to obtain RP and user info.
 * @returns {Promise<void>} A promise that resolves when the synchronization signal is sent.
 */
export const syncPasskeysWithAuthenticator = async (
  passkeys: PasskeyCollection,
  session: SessionManager,
): Promise<void> => {
  try {
    const sessionInfo = session.getSessionInfo();
    if (!sessionInfo) {
      Logger.logger.debug("No session info available for syncing passkeys.");
      return;
    }

    const { id: userId, rpId } = sessionInfo;
    const credentialIds = passkeys
      .map((pk) => pk.credentialId)
      .filter(Boolean) as string[];

    await signalAllAcceptedCredentials(rpId, userId, credentialIds);
  } catch (error) {
    Logger.logger.debug(`Error syncing passkeys: ${error}`);
  }
};

/**
 * Signals to the authenticator that a specific credential ID is no longer valid
 * for the given relying party (RP).
 *
 * @param {string} [credentialId] - The credential ID of the passkey.
 * @param {string} [rpId] - The relying party ID associated with the credential.
 * @returns {Promise<void>} A promise that resolves after signaling the authenticator.
 */
export const handlePotentialStalePasskey = async (
  credentialId?: string,
  rpId?: string,
): Promise<void> => {
  try {
    if (!credentialId || !rpId) {
      Logger.logger.debug("Credential ID or RP ID is missing.");
      return;
    }

    await signalUnknownCredential(rpId, credentialId);
  } catch (error) {
    Logger.logger.debug(`Error signaling unknown credential: ${error}`);
  }
};
