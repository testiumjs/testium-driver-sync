'use strict';

var assert = require('assertive');
var _private = require('./console');

var parseLogs = _private.parseLogs;
var filterLogs = _private.filterLogs;

var TYPES = [
  'error',
  'warn',
  'log',
  'debug',
];

var cachedLogs = [];

exports.getConsoleLogs = function getConsoleLogs(type) {
  if (type) {
    assert.include(type, TYPES);
  }

  var newLogs = parseLogs(this.driver.getConsoleLogs());
  var logs = cachedLogs.concat(newLogs);

  var filtered = filterLogs(logs, type);
  cachedLogs = filtered.rest || [];
  return filtered.matched || [];
};
