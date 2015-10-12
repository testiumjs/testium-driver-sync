'use strict';

var _ = require('lodash');
var assert = require('assertive');

var builtIns = [
  require('./cookie'),
  require('./element'),
  require('./navigation'),
  require('./page')
];

function Browser(driver, options) {
  this.driver = driver;

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
      // fall-through

    case 'string':
      return this.driver.evaluate(clientFunction);

    default:
      throw new Error(invocation);
  }
};

function forwardToDriver(method) {
  Browser.prototype[method] = function() {
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
