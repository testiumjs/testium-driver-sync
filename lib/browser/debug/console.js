'use strict';

var _ = require('lodash');

var logMap = {
  'SEVERE': 'error',
  'WARNING': 'warn',
  'INFO': 'log',
  'DEBUG': 'debug'
};

function convertLogType(log) {
  if (log.level) {
    log.type = logMap[log.level];
    delete log.level;
  }
  return log;
}

exports.parseLogs = function parseLogs(logs) {
  return _.map(logs, convertLogType);
};

exports.filterLogs = function filterLogs(logs, type) {
  if (!type) {
    return { matched: logs };
  }
  return _.groupBy(logs, function(log) {
    return log.type === type ? 'matched' : 'rest';
  });
};