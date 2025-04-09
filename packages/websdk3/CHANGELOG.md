## @loginid/websdk3 [3.2.2](https://gitlab.com/loginid/software/sdks/loginid-websdk3/compare/@loginid/websdk3@3.2.1...@loginid/websdk3@3.2.2) (2025-04-09)

### Bug Fixes

* **websdk3:** fixed passkey autofill issues ([46688a3](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/46688a389837c267329e7325303b6dac495f9f4d))

## @loginid/websdk3 [3.2.0](https://gitlab.com/loginid/software/sdks/loginid-websdk3/compare/@loginid/websdk3@3.1.1...@loginid/websdk3@3.2.0) (2025-04-02)

### Features

* **core:** added init version of core internal package ([3966aa1](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/3966aa1cb4e1ccc2a4f19e1a5f53f0a4e0e5df50))
* **websdk3:** Added wallet auth implementation ([9baa40f](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/9baa40f39bbc6f02b1634d95f38df5e0474b4857))

## @loginid/websdk3 [3.1.1](https://gitlab.com/loginid/software/sdks/loginid-websdk3/compare/@loginid/websdk3@3.1.0...@loginid/websdk3@3.1.1) (2025-03-10)

### Bug Fixes

* **websdk3:** removed uneeded dependencies ([9f66615](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/9f6661518ed4f6aea44d8df70f3dc41c68114ad4))

## [3.1.0](https://gitlab.com/loginid/software/sdks/loginid-websdk3/compare/v3.0.7...v3.1.0) (2025-03-04)

### Features

* **trust-id:** added trust device implementation ([940f8a7](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/940f8a730e616f8f988c8c96503f0fa832388dfb))

### Bug Fixes

* **deviceId:** added deviceId to authenticateWithPasskey passkey login ([3fed381](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/3fed38115adb98fa9dd2c2be6c076b7470f6a296))
* **deviceId:** update responseID to responseId to match server response ([eba3fda](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/eba3fda1105735d01daca548512ae8cb92b493fa))

### Miscellaneous Chores

* **AuthResult:** added `userId` and `passkeyId` to AuthResult ([f7c58c8](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/f7c58c8e8ee8dead3f435b717633ab8b7c93bfb7))
* **release:** 3.0.8-next.1 ([78ea7ea](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/78ea7ea21ab4198a3b096dd395cbbb86f56fd269))
* **ua-parser:** removed ua-parser dependency ([fa17b58](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/fa17b588a997c1aedb40807acad1ed4889df9e2d))

## [3.0.8-next.1](https://gitlab.com/loginid/software/sdks/loginid-websdk3/compare/v3.0.7...v3.0.8-next.1) (2025-01-30)

### Bug Fixes

* **deviceId:** update responseID to responseId to match server response ([eba3fda](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/eba3fda1105735d01daca548512ae8cb92b493fa))

## [3.0.7](https://gitlab.com/loginid/software/sdks/loginid-websdk3/compare/v3.0.6...v3.0.7) (2025-01-09)

### Bug Fixes

* **regex for getAppId:** base url doesn't have to be UUID anymore ([4d0da6e](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/4d0da6e9c93a89a702ec0d4f440b8ae3dd5e50de))

## [3.0.6](https://gitlab.com/loginid/software/sdks/loginid-websdk3/compare/v3.0.5...v3.0.6) (2024-10-04)

### Miscellaneous Chores

* **README:** fix broken link to reference doc ([6ec8e4e](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/6ec8e4eb464124d28682a03e28adaaab032764db))

## [3.0.5](https://gitlab.com/loginid/software/sdks/loginid-websdk3/compare/v3.0.4...v3.0.5) (2024-10-01)

### Bug Fixes

* **authenticateWithPasskey:** fixed case where if callback is not supplied error would be thrown ([d70faa9](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/d70faa96fa54d48685272115513200ad9a04592c))
* **usernameType:** username type defaults to 'other' now ([020be21](https://gitlab.com/loginid/software/sdks/loginid-websdk3/commit/020be214694400d0c941361faf0d858d4de495f2))

## [3.0.4](https://gitlab.com/loginid/software/sdks/websdk3/compare/v3.0.3...v3.0.4) (2024-09-25)

### Bug Fixes

* **autofill:** improved autofill API ([83e926c](https://gitlab.com/loginid/software/sdks/websdk3/commit/83e926c018c0465745b494ec8dcfedc9434a576e))
* **Passkey Types:** reexport passkey types ([bfcbc75](https://gitlab.com/loginid/software/sdks/websdk3/commit/bfcbc751029618f07c1e25b7386294f9f3bd2eb4))
* **tx-conf-jwt:** fix for tx-conf breaking ([227d149](https://gitlab.com/loginid/software/sdks/websdk3/commit/227d14943bb1c79ece5c7c69bfcb8e949f785697))

## [3.0.3](https://gitlab.com/loginid/software/sdks/websdk3/compare/v3.0.2...v3.0.3) (2024-09-20)

### Bug Fixes

* **readme:** update README link for doc ref ([8a54507](https://gitlab.com/loginid/software/sdks/websdk3/commit/8a54507dd0e51f4abcb53a9e2f25f3ad4ba49ea9))

## [3.0.2](https://gitlab.com/loginid/software/sdks/websdk3/compare/v3.0.1...v3.0.2) (2024-09-18)

### Bug Fixes

* **AuthResult:** reverted back to token response ([b471c5f](https://gitlab.com/loginid/software/sdks/websdk3/commit/b471c5f16b9d6bea724da76def6ad8581db724ea))

## [3.0.1](https://gitlab.com/loginid/software/sdks/websdk3/compare/v3.0.0...v3.0.1) (2024-09-12)

### Bug Fixes

* **navigator methods:** unexpose the navigator methods ([4dad7dc](https://gitlab.com/loginid/software/sdks/websdk3/commit/4dad7dcb66333b38fc624281dd5d515ba61f996e))

## [3.0.0](https://gitlab.com/loginid/software/sdks/websdk3/compare/v2.0.0...v3.0.0) (2024-09-12)

### ⚠ BREAKING CHANGES

* **method signatures:** Since method names are being updated, this is a breaking change.

### Features

* **method signatures:** renamed and updated methods and params ([9178bea](https://gitlab.com/loginid/software/sdks/websdk3/commit/9178beaf994fe0f9e9d5a505ac13f6f2cd3b5359))

## [1.9.0](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.8.0...v1.9.0) (2024-09-04)

### Features

* **deviceid:** added device ID store ([21ef72b](https://gitlab.com/loginid/software/sdks/websdk3/commit/21ef72bedfb0ee322f49a28a8298cb60796e7d90))
* **rule engine:** added init rule engine ([10f25e1](https://gitlab.com/loginid/software/sdks/websdk3/commit/10f25e1c18859e581ce0019ea9f72cd152f26c9c))

### Bug Fixes

* **response options:** added forgotten fallback options to authentication response ([e594a71](https://gitlab.com/loginid/software/sdks/websdk3/commit/e594a713a219d65a3f09d827787b623588d87206))

### Miscellaneous Chores

* **release:** 1.9.0-next.1 [skip ci] ([f4b428c](https://gitlab.com/loginid/software/sdks/websdk3/commit/f4b428cae6e632ccfc8823593a986481788c5557))

## [1.9.0-next.1](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.8.0...v1.9.0-next.1) (2024-08-23)

### Features

* **deviceid:** added device ID store ([21ef72b](https://gitlab.com/loginid/software/sdks/websdk3/commit/21ef72bedfb0ee322f49a28a8298cb60796e7d90))
* **rule engine:** added init rule engine ([10f25e1](https://gitlab.com/loginid/software/sdks/websdk3/commit/10f25e1c18859e581ce0019ea9f72cd152f26c9c))

## [1.8.0](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.7.0...v1.8.0) (2024-07-18)

### Features

* **utils:** added verifyConfigSettings to validate config ([3077733](https://gitlab.com/loginid/software/sdks/websdk3/commit/307773382ca51fd89c87927060fc72fe0c730e9f))

## [1.7.0](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.6.0...v1.7.0) (2024-07-15)

### Features

* **code:** send email/sms OTP ([ca64719](https://gitlab.com/loginid/software/sdks/websdk3/commit/ca6471982bc8ca1f9545436aaae10f466a0a1112))

### Miscellaneous Chores

* **openapi gen:** openAPI generation is now totally automated ([df35aad](https://gitlab.com/loginid/software/sdks/websdk3/commit/df35aad986f9ce5c2c531cfe2ac594b22778919e))

## [1.6.0](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.5.0...v1.6.0) (2024-06-21)

### Features

* **rule engine:** added typings for device ID ([a15add8](https://gitlab.com/loginid/software/sdks/websdk3/commit/a15add8466aa3306200ea560a043bfece2c653e4))

## [1.5.0](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.4.0...v1.5.0) (2024-06-14)

### Features

* **getuser:** added getUser method to retrieve basic user data from JWT ([3814896](https://gitlab.com/loginid/software/sdks/websdk3/commit/3814896809b87f5baaaad4b77983e6e6efe359b1))

### Bug Fixes

* **autofill:** fix for abortcontroller management ([269fc5a](https://gitlab.com/loginid/software/sdks/websdk3/commit/269fc5ac1a5a920cbd5f1c7d5281e59500717435))

## [1.4.0](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.3.1...v1.4.0) (2024-06-09)

### Features

* **webauthn helper:** added a static helper class for WebAuthn API calls ([f3e09a0](https://gitlab.com/loginid/software/sdks/websdk3/commit/f3e09a08f4e4021ff61c7f9be03b7a17f315929b))

## [1.3.1](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.3.0...v1.3.1) (2024-06-08)

### Bug Fixes

* **security vuln:** fix braces 3.0.2 vuln ([d3a2a8c](https://gitlab.com/loginid/software/sdks/websdk3/commit/d3a2a8ce64295192332a3c63c165cc6d0ddce848))

## [1.3.0](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.2.0...v1.3.0) (2024-06-05)

### Features

* **add-passkey:** add addPasskey and addPasskeyWithCode functions ([01c6cce](https://gitlab.com/loginid/software/sdks/websdk3/commit/01c6cceb2e962da532d51873e066e1101111b8da))
* adds auth with code and generate code with passkey endpoints ([0f83096](https://gitlab.com/loginid/software/sdks/websdk3/commit/0f830965acf76a28eb94296c86dedd1f41018cfc))
* **jwt:** add utilities for jwt cookie management ([6f5ddea](https://gitlab.com/loginid/software/sdks/websdk3/commit/6f5ddea646f02d8568a0457578098b2d28cf6698))

## [1.2.0](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.1.1...v1.2.0) (2024-04-09)


### Features

* **add passkey:** adds passkey for existing users ([088b732](https://gitlab.com/loginid/software/sdks/websdk3/commit/088b732b512d62f14dee5fe295a919331b2497b3))


### Bug Fixes

* **autofill:** can pass username as an empty string now for usernameless ([5aafe35](https://gitlab.com/loginid/software/sdks/websdk3/commit/5aafe35aac61f4da413d0f20f2baedd81748eb0d))
* **tx conf:** moved options around ([2c63b25](https://gitlab.com/loginid/software/sdks/websdk3/commit/2c63b25c3cb3127cba34a7c3517869b97475c1e0))

## [1.1.1](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.1.0...v1.1.1) (2024-03-27)


### Bug Fixes

* **passkeys:** fix for autofill not passing ([4e1c669](https://gitlab.com/loginid/software/sdks/websdk3/commit/4e1c669a95519d6b52990ebb142f361bbea699b1))

## [1.1.0](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.0.1...v1.1.0) (2024-03-27)


### Features

* **passkeys:** added tranaction confirmation and also fixed up usernameless option ([30b1eb4](https://gitlab.com/loginid/software/sdks/websdk3/commit/30b1eb4ba52220d898bb832eb37b6baac8c30419))

## [1.0.1](https://gitlab.com/loginid/software/sdks/websdk3/compare/v1.0.0...v1.0.1) (2024-2-28)


### Bug Fixes

* **npm dist files:** updated pipeline to include ./dist files for npm ([a35cf1d](https://gitlab.com/loginid/software/sdks/websdk3/commit/a35cf1d85c8b893dd18ed87d695678a441fd569f))

## 1.0.0 (2024-2-23)


### Features

* **autofill passkeys:** added conditional UI capability to passkey authentication ([7222cf2](https://gitlab.com/loginid/software/sdks/websdk3/commit/7222cf274c7a566e8fa04bc12fc98952fc4b06b8))
* **conditional ui check:** added conditional UI availability helper function ([f6be2f0](https://gitlab.com/loginid/software/sdks/websdk3/commit/f6be2f028a3d1a8947aa6815994561e09e5d93a7))
* **initalization:** initial implementation of the sdk ([700d37b](https://gitlab.com/loginid/software/sdks/websdk3/commit/700d37beb198d50358a0c414237d669a05290d7f))
* **passkeyerror:** identify passkey errors with PasskeyError to provide better error messages ([bde5a4c](https://gitlab.com/loginid/software/sdks/websdk3/commit/bde5a4c9b71c57950e636a94f07bfafea76e865c))
