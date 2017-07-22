### 2.3.1

* Fixin mixin require logic - **[@dbushong](https://github.com/dbushong)** [#13](https://github.com/testiumjs/testium-driver-sync/pull/13)
  - [`a97f567`](https://github.com/testiumjs/testium-driver-sync/commit/a97f56737000d9b2dc7929562fefc2fa39c6d865) **fix:** properly handle modules-as-mixins
  - [`b5fc336`](https://github.com/testiumjs/testium-driver-sync/commit/b5fc3365e1f98a04dc93678776a4c766a7194534) **test:** fix tests for assertion library spacing tweaks


### 2.3.0

* feat: add & test buttonUp/Down & movePointerRelativeTo - **[@dbushong](https://github.com/dbushong)** [#12](https://github.com/testiumjs/testium-driver-sync/pull/12)
  - [`f416cf4`](https://github.com/testiumjs/testium-driver-sync/commit/f416cf46fab78522f0632ec9917c900ee38c5107) **feat:** add & test buttonUp/Down & movePointerRelativeTo
* Apply latest nlm generator - **[@i-tier-bot](https://github.com/i-tier-bot)** [#10](https://github.com/testiumjs/testium-driver-sync/pull/10)
  - [`15b46d4`](https://github.com/testiumjs/testium-driver-sync/commit/15b46d4c6702b1e52e86b54b0aecd62d6864630a) **chore:** Apply latest nlm generator
  - [`8aaf0fd`](https://github.com/testiumjs/testium-driver-sync/commit/8aaf0fdbf9795796ff1d8d1e69410dce184848d0) **style:** Lint rules and license headers
  - [`faf388b`](https://github.com/testiumjs/testium-driver-sync/commit/faf388ba8695380421abf0f7fef85189857ccc2c) **chore:** Use Groupon user for publishing
  - [`e5847cb`](https://github.com/testiumjs/testium-driver-sync/commit/e5847cba2287ca1b1c947050dd3272082580ce66) **style:** Add license header and fix spacing


2.2.1
-----
* Fix `switchToFrame` tests - @jkrems
  https://github.com/testiumjs/testium-driver-sync/pull/6
  - Remove `getElement` exception checking, moved to `webdriver-http-sync`
  - Fix nested switch to frame
  - Fix tests to fail as they should

2.2.0
-----
* Deprecate: getElement returns null - @jkrems
  https://github.com/testiumjs/testium-driver-sync/pull/7
* Better refresh test - @jkrems
  https://github.com/testiumjs/testium-driver-sync/pull/5

2.1.0
-----
* Add support for `waitForElementNotExist` - @jkrems
  https://github.com/testiumjs/testium-driver-sync/pull/4

2.0.0
-----
This moves priming and clearing cookies into `testium-core`.

The remaining changes are minor cleanup.

bc94e04 Fix tests when running as `mocha | cat`
117fcf1 Use proper version of testium-core
27811d1 Only ship lib to npm
5a48026 Use latest testium-core
058b462 Fix linting errors in unit tests
94fdd21 Port browser unit tests
dd1399d Port assert unit tests
720193c Inline usage of _getElementWithProperty
583791e Add npub for clean releases
d5c15e9 Remove traces of jshint config
0355bea Fix typo in test description

1.0.3
-----
* Initial release
