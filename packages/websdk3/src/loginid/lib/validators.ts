// Copyright (C) LoginID

import {
  Complete,
  LoginIDConfig,
  MfaFactorName,
  MfaInfo,
  MfaOtpFactorName,
  MfaPerformFactorOptions,
} from "../types";
import {
  PublicKeyCredentialCreationOptions,
  PublicKeyCredentialRequestOptions,
} from "../../api";
import LoginIDError from "../../errors/loginid";
import { parseJwt } from "../../utils";

class LoginIDConfigValidator {
  /**
   * Holds the configuration settings for the LoginID integration, including API base URL and optional app ID.
   */
  private readonly config: LoginIDConfig;

  /**
   * Constructs a new instance of the LoginIDConfigValidator class, initializing with the provided configuration.
   * @param {LoginIDConfig} config Configuration object for LoginID API, including the base URL and optional app ID.
   */
  constructor(config: LoginIDConfig) {
    this.config = config;
  }

  /**
   * Retrieves the application ID from the configuration or extracts it from the base URL if not provided.
   * @returns {string} The application ID.
   * @throws {Error} If the app ID is not found in the configuration or the base URL, throws an error.
   */
  getAppId(): string {
    if (this.config.appId) {
      return this.config.appId;
    }

    // Regex to capture the subdomain part before the first period in the baseUrl
    const pattern = /https?:\/\/([^.]+)\./;
    const match = this.config.baseUrl.match(pattern);
    if (match) {
      return match[1];
    } else {
      throw new Error("Invalid LoginID base URL. App ID not found.");
    }
  }
}

/**
 * Utility class for validating parameters related to LoginID MFA operations.
 */
class LoginIDParamValidator {
  /**
   * Validates and extracts the application ID from the configuration.
   *
   * @param {MfaOtpFactorName} factorName - The name of the OTP MFA factor being validated.
   */
  public static checkValidMfaOtpFactorName(factorName: MfaOtpFactorName) {
    if (factorName !== "otp:email" && factorName !== "otp:sms") {
      new LoginIDError(
        `MFA factor ${factorName} is not supported in the current MFA request flow.`,
      );
    }
  }

  /**
   * Validates and extracts necessary parameters for performing an MFA factor.
   *
   * @param {MfaFactorName} factorName - The name of the MFA factor being validated.
   * @param {MfaInfo | null} info - The current MFA session information.
   * @param {MfaPerformFactorOptions} options - The provided options for performing the MFA factor.
   * @returns {Pick<Complete<MfaPerformFactorOptions>, "payload" | "session">} - The validated session and payload.
   */
  public static mfaOptionValidator(
    factorName: MfaFactorName,
    info: MfaInfo | null,
    options: MfaPerformFactorOptions,
  ): Pick<Complete<MfaPerformFactorOptions>, "payload" | "session"> {
    const { session = info?.session, payload = "" } = options;

    if (!session) {
      throw new LoginIDError("A session is required to perform MFA factor.");
    }

    if (payload) {
      return { session, payload };
    }

    const canFindPayloadInInfo = new Set<MfaFactorName>(["passkey"]);

    if (info?.next && canFindPayloadInInfo.has(factorName)) {
      const factor = info.next.find((f) => f.action.name === factorName);

      if (factor?.options?.length) {
        const factorPayload = factor.options[0].value;

        return { session, payload: factorPayload };
      }
    }

    throw new LoginIDError("Payload is required to perform MFA factor.");
  }

  /**
   * Validates and parses a passkey payload.
   *
   * @param {string} payload - The encoded passkey payload.
   * @returns {PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions} - The parsed passkey options.
   */
  public static validatePasskeyPayload(
    payload: string,
  ): PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions {
    if (!payload) {
      throw new LoginIDError("Payload is required for passkeys.");
    }

    const options = parseJwt("." + payload);
    if (!options) {
      throw new LoginIDError("Invalid payload for passkeys.");
    }

    if (LoginIDParamValidator.isPublicKeyCredentialCreationOptions(options)) {
      return options;
    }

    if (LoginIDParamValidator.isPublicKeyCredentialRequestOptions(options)) {
      return options;
    }

    throw new LoginIDError("Invalid payload for passkey.");
  }

  /**
   * Checks if the given object is a valid `PublicKeyCredentialCreationOptions`.
   *
   * @param {any} options - The object to check.
   * @returns {options is PublicKeyCredentialCreationOptions} - `true` if valid, otherwise `false`.
   */
  public static isPublicKeyCredentialCreationOptions(
    options: any,
  ): options is PublicKeyCredentialCreationOptions {
    return !!(
      options.rp?.id &&
      options.challenge &&
      options.pubKeyCredParams &&
      options.user?.id
    );
  }

  /**
   * Checks if the given object is a valid `PublicKeyCredentialRequestOptions`.
   *
   * @param {any} options - The object to check.
   * @returns {options is PublicKeyCredentialRequestOptions} - `true` if valid, otherwise `false`.
   */
  public static isPublicKeyCredentialRequestOptions(
    options: any,
  ): options is PublicKeyCredentialRequestOptions {
    return !!(
      options.rpId &&
      options.challenge &&
      options.allowCredentials &&
      options.userVerification
    );
  }
}

export { LoginIDConfigValidator, LoginIDParamValidator };

export default LoginIDConfigValidator;
