'use strict';

var Url = require('url');

var _ = require('lodash');
var debug = require('debug')('testium-driver-sync:navigation');

var makeUrlRegExp = require('./makeUrlRegExp');
var waitFor = require('./wait');

exports._forwarded = [
  'refresh',
  'getUrl'
];

exports.navigateTo = function navigateTo(url, options) {
  var targetUrl = this._getNewPageUrl(url, options);
  debug('navigateTo', targetUrl);
  this.driver.navigateTo(targetUrl);

  // Save the window handle for referencing later
  // in `switchToDefaultWindow`
  this.driver.rootWindow = this.driver.getCurrentWindowHandle();
};

exports.getPath = function getPath() {
  return Url.parse(this.getUrl()).path;
};

exports.waitForUrl = function waitForUrl(url, query, timeout) {
  if (typeof query === 'number') {
    timeout = query;
  } else if (_.isObject(query)) {
    url = makeUrlRegExp(url, query);
  }
  return waitFor(url, 'Url', _.bindKey(this, 'getUrl'), timeout || 5000);
};

exports.waitForPath = function waitForPath(path, timeout) {
  return waitFor(path, 'Path', _.bindKey(this, 'getPath'), timeout || 5000);
};
