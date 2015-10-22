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
