'use strict';

var path = require('path');

var WebDriver = require('webdriver-http-sync');
var debug = require('debug')('testium-driver-sync:browser');
var _ = require('lodash');

var Browser = require('./browser');
var Assertions = require('./assert');

function applyMixin(obj, mixin) {
  debug('Applying mixin to %s', obj.constructor.name, mixin);
  var mixinFile = path.resolve(process.cwd(), mixin);
  _.extend(obj, require(mixinFile));
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
