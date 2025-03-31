# LoginID Web SDKs

Monorepo for LoginID's web sdks. This repository contains all the SDKs and shared packages related to passwordless authentication and orchestration, including passkey support, multi-factor authentication (MFA), and embedded iframe experiences.

## Structure

```
packages/
├── core/                   # Private shared utilities and core logic for all SDKs
├── websdk3/                # Public Web SDK for passwordless + MFA
└── checkout/
    ├── merchant/           # Public SDK for checkout merchants with iframe orchestration
    ├── wallet/             # Public SDK for wallet-based passkey authentication
    └── commons/            # Private shared code between merchant and wallet SDKs
```

## Packages Overview

### @loginid/core (private)
Common, reusable utilities and core logic used across all SDKs. Not intended for public use.

---

### @loginid/websdk3
Public Web SDK to support passwordless authentication flows with optional MFA. Lightweight, flexible, and easy to integrate.

---

### @loginid/checkout-merchant
SDK for checkout merchants that enables passwordless authentication using passkeys and embedded iframes. Handles orchestration in the checkout context.

---

### @loginid/checkout-wallet
Core SDK for wallet providers to enable passkey-based passwordless authentication. Works with embedded orchestration to ensure seamless user experience.

---

### @loginid/checkout-commons (private)
Internal shared logic between `merchant` and `wallet` SDKs to reduce duplication and maintain consistency.

---

## Tooling

- Package Manager: npm (using workspaces)
- Build Tool: tsup
- Testing: Jest
- Language: TypeScript

## Getting Started

Install dependencies:

```bash
npm install
```

For package-specific commands, navigate into each `packages/*` directory.

## Scripts

Some common scripts available at the root level:

- `npm run build` — Build all packages using `tsup`
- `npm run test` — Run all tests using `jest`
- `npm run clean` — Clean all dist outputs

## Development Workflow

Tooling is still evolving, but here’s the current workflow for local development:

1. **Install Dependencies**

       npm install

   This will install and link all workspace dependencies via npm workspaces.

2. **Build Dependent Packages First**

   If the package you’re developing depends on another local package (e.g., `merchant` depends on `commons`), you must manually build the dependency first:

       cd packages/checkout/commons
       npm run build

3. **Develop Your Target Package**

   Now, go back to the package you’re actively developing. Imports from the dependency should resolve correctly.

4. **When Updating Dependencies**

   If any local dependency gets updated, rebuild it again to propagate the changes:

       cd packages/checkout/commons
       npm run build
