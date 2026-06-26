# LoginID Checkout SDK – Wallet

The LoginID Checkout SDK for Wallets enables passkey-based passwordless authentication within embedded wallet experiences.
It facilitates secure and efficient handling of authentication requests initiated from merchant sites.

## Features

- **Passkey-Based Authentication**: Implements WebAuthn standards for secure, passwordless login flows.
- **Embedded Orchestration**: Manages cross-origin authentication requests within embedded iframe environments.
- **Authentication Request Handling**: Processes authentication intents initiated by merchant checkout flows.

## How It Works

The SDK supports key user scenarios involving multi-factor authentication (MFA) and passkeys:

1. **Passkey Creation During User Sign-Up**: Integrate passkey creation into your existing banking sign-up flow, allowing users to register passkeys for future authentication.
2. **Transaction Confirmation Using Passkeys**: Enable users to authenticate and approve transactions using their registered passkeys, enhancing security and user experience.

For optimal user experience, it's recommended to call the `discovery` method on the landing page of the wallet domain immediately upon page load. This method determines whether to continue the embedded flow via iframe or switch to a full-page redirect (or your fallback method), ensuring a smooth and seamless experience.

## Installation

To integrate the LoginID Checkout Wallet SDK into your project, run:

    npm install @loginid/checkout-wallet

## Usage

For detailed integration instructions and example implementations, refer to the [Wallet Setup Guide](https://docs.dev.loginid.io/user-scenario/checkout/wallet/).

## Contact and Support

- **Email**: support@loginid.io
- **Documentation**: https://docs.loginid.io
- **Forum**: https://forum.loginid.dev
- **Bug Reports**: https://loginid.dev
- **Dashboard**: https://dashboard.loginid.io

## License

This project is licensed under the Apache 2.0 License. See LICENSE.md for details.
