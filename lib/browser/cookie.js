'use strict';

var _ = require('lodash');
var assert = require('assertive');

var getTestiumCookie = require('testium-cookie').getTestiumCookie;

exports._forwarded = [
  // TODO: Port validateCookie to webdriver-http-sync
  'setCookie',
  'clearCookies',
];

exports.setCookies = function setCookies(cookies) {
  _.each(cookies, this.setCookie, this);
  return this;
};

exports.getCookie = function getCookie(name) {
  assert.hasType('getCookie(name) - requires (String) name', String, name);

  var cookies = this.driver.getCookies();
  return _.find(cookies, { name: name });
};

exports.getCookies = function getCookies() {
  return _.reject(this.driver.getCookies(), { name: '_testium_' });
};

exports.clearCookie = function clearCookie(name) {
  return this.setCookie({
    name: name,
    value: 'dummy', // setCookie doesn't allow null values
    expiry: 0,
  });
};

// BEGIN _testium_ cookie magic

exports._getTestiumCookieField = function _getTestiumCookieField(name) {
  var cookies = this.driver.getCookies();
  var testiumCookie = getTestiumCookie(cookies);
  return testiumCookie[name];
};

exports.getStatusCode = function getStatusCode() {
  return this._getTestiumCookieField('statusCode');
};

exports.getHeaders = function getHeaders() {
  return this._getTestiumCookieField('headers');
};

exports.getHeader = function getHeader(name) {
  assert.hasType('getHeader(name) - require (String) name', String, name);
  return this.getHeaders()[name];
};

// END _testium_ cookie magic
