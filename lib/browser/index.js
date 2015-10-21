'use strict';

var _ = require('lodash');
var assert = require('assertive');
var Bluebird = require('bluebird');

var builtIns = [
  require('./alert'),
  require('./cookie'),
  require('./debug'),
  require('./element'),
  require('./input'),
  require('./navigation'),
  require('./page'),
  require('./window'),
];

function Browser(driver, options) {
  var invocation = 'new Browser(driver, targetUrl, commandUrl)';
  assert.hasType(invocation + ' - requires (Object) driver', Object, driver);

  this.driver = driver;
  this.capabilities = driver.capabilities;

  options = options || {};
  this.appUrl = options.appUrl;
  this._getNewPageUrl = options.getNewPageUrl;
}
module.exports = Browser;

Browser.prototype.evaluate = function evaluate() {
  var args = _.toArray(arguments);
  var clientFunction = args.pop();

  var invocation = 'evaluate(clientFunction) - requires (Function|String) clientFunction';
  assert.truthy(invocation, clientFunction);

  switch (typeof clientFunction) {
  case 'function':
    clientFunction =
      'return (' + clientFunction + ').apply(this, ' + JSON.stringify(args) + ');';
    /* falls through */
  case 'string':
    return this.driver.evaluate(clientFunction);

  default:
    throw new Error(invocation);
  }
};

Browser.prototype.close = function close(callback) {
  return Bluebird
    .try(this.driver.close, [], this.driver)
    .nodeify(callback); // compatible with testium
};

function forwardToDriver(method) {
  Browser.prototype[method] = function _forwarded() {
    return this.driver[method].apply(this.driver, arguments);
  };
}

function addBuiltIn(builtIn) {
  var methods = _.omit(builtIn, '_forwarded');
  if (builtIn._forwarded) {
    _.each(builtIn._forwarded, forwardToDriver);
  }
  _.extend(Browser.prototype, methods);
}
builtIns.forEach(addBuiltIn);
