'use strict';

var debug = require('debug')('testium-driver-sync:browser');
var _ = require('lodash');

function Browser(driver, options) {
  this.driver = driver;

  options = options || {};
  this.appUrl = options.appUrl;
  this._getNewPageUrl = options.getNewPageUrl;
}
module.exports = Browser;

Browser.prototype._forwardToDriver = function _forwardToDriver(method) {
  this[method] = function _forwarded() {
    return this.driver[method].apply(this.driver, arguments);
  }
}

Browser.prototype._forwardToDriver('clearCookies');
Browser.prototype._forwardToDriver('getPageTitle');
Browser.prototype._forwardToDriver('setPageSize');
Browser.prototype._forwardToDriver('getPageSize');

Browser.prototype.navigateTo = function(url, options) {
  this.driver.navigateTo(this._getNewPageUrl(url, options));
};
