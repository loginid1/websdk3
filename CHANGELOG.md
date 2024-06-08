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
