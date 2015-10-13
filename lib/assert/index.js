'use strict';

var _ = require('lodash');

function Assertions(driver, browser) {
  this.driver = driver;
  this.browser = browser;
}

_.each([
  require('./element'),
  require('./imgLoaded'),
  require('./navigation')
], function(mixin) {
  _.extend(Assertions.prototype, mixin);
});

module.exports = Assertions;
