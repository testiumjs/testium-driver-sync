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

var getTestiumCookie = require('testium-cookie').getTestiumCookie;

exports._forwarded = [
  // TODO: Port validateCookie to webdriver-http-sync
  'setCookie',
  'clearCookie',
  'clearCookies',
];

exports.setCookies = function setCookies(cookies) {
  _.each(cookies, this.setCookie.bind(this));
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
