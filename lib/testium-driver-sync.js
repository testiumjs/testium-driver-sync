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

var path = require('path');

var WebDriver = require('webdriver-http-sync');
var debug = require('debug')('testium-driver-sync:browser');
var _ = require('lodash');

var Browser = require('./browser');
var Assertions = require('./assert');

function applyMixin(obj, mixin) {
  debug('Applying mixin to %s', obj.constructor.name, mixin);
  // this is all to be bug-compatible with our old implementation, which
  // would parse a mixin path of "test/blah" the same as "./test/blah"
  var cwd = process.cwd();
  var paths = [path.resolve(cwd, mixin), path.resolve(cwd, 'node_modules', mixin)];
  var mixins;
  _.forEach(paths, function eachFile(mixinFile) {
    try {
      mixins = require(mixinFile); // eslint-disable-line global-require
      return false;
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND') throw err;
      return undefined;
    }
  });
  if (!mixins) {
    throw new Error('couldn\'t find ' + mixin + ' in ' + paths.join(' or '));
  }
  _.extend(obj, mixins);
}

function applyMixins(obj, mixins) {
  _.each(mixins, _.partial(applyMixin, obj));
}

function createDriver(testium) {
  var config = testium.config;

  var seleniumUrl = testium.config.get('selenium.serverUrl');
  var requestOptions = config.get('webdriver.requestOptions', {});
  var desiredCapabilities = config.get('desiredCapabilities');

  var driver = new WebDriver(seleniumUrl, desiredCapabilities, requestOptions);

  var browser = testium.browser = new Browser(driver, {
    appUrl: 'http://127.0.0.1:' + config.get('app.port'),
    getNewPageUrl: testium.getNewPageUrl,
  });
  browser.assert = new Assertions(driver, browser);

  applyMixins(browser, config.get('mixins.browser', []));
  applyMixins(browser.assert, config.get('mixins.assert', []));

  // Default to reasonable size.
  // This fixes some phantomjs element size/position reporting.
  browser.setPageSize({ height: 768, width: 1024 });

  return testium;
}

module.exports = createDriver;
