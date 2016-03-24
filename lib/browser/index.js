/*
 * Copyright (c) 2015, Groupon, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of GROUPON nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
  require('./pointer'),
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
