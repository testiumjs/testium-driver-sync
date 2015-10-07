'use strict';

var WebDriver = require('webdriver-http-sync');
var debug = require('debug')('testium-driver-sync:browser');

var Browser = require('./browser');

function createDriver(testium) {
  var config = testium.config;

  var seleniumUrl = testium.config.get('selenium.serverUrl');
  var requestOptions = config.get('webdriver.requestOptions', {});
  var desiredCapabilities = config.get('desiredCapabilities');

  var driver = new WebDriver(seleniumUrl, desiredCapabilities, requestOptions);

  var browser = testium.browser = new Browser(driver, {
    appUrl: 'http://127.0.0.1:' + config.get('app.port'),
    getNewPageUrl: testium.getNewPageUrl
  });

  // Default to reasonable size.
  // This fixes some phantomjs element size/position reporting.
  browser.setPageSize({ height: 768, width: 1024 });

  var skipPriming = false;
  var keepCookies = false;

  if (skipPriming) {
    debug('Skipping priming load');
  } else {
    driver.navigateTo(testium.getInitialUrl());
    debug('Browser was primed');
  }

  if (keepCookies) {
    debug('Keeping cookies around');
  } else {
    debug('Clearing cookies for clean state');
    browser.clearCookies();
  }

  return testium;
}

module.exports = createDriver;
