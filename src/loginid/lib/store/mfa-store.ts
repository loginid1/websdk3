import { MfaInfo } from "../../types";
import LocalStorageWrapper from "./local-storage";

const mfaStorageKey = (appId: string) => `LoginID_${appId}_mfa-session`;

/**
 * A storage utility class for managing Multi-Factor Authentication (MFA) session data using localStorage.
 */
export class MfaStore extends LocalStorageWrapper {
  public static persistInfo(appId: string, info?: MfaInfo): void {
    this.setItem(mfaStorageKey(appId), info);
  }

  public static getInfo(appId: string): MfaInfo | null {
    return this.getItem(mfaStorageKey(appId));
  }

  public static updateSession(appId: string, session: string): void {
    let info = MfaStore.getInfo(appId);

    if (!info) {
      info = { session: session };
    } else {
      info.session = session;
    }

    MfaStore.persistInfo(appId, info);
  }
}
