'use strict';

var util = require('util');

var _ = require('lodash');

function matches(stringOrRegex, testUrl) {
  return stringOrRegex.test(testUrl);
}

function createTest(stringOrRegex, waitingFor) {
  if (_.isString(stringOrRegex)) {
    return _.partial(_.isEqual, stringOrRegex);
  } else if (_.isRegExp(stringOrRegex)) {
    return _.partial(matches, stringOrRegex);
  }
  throw new Error(
    util.format('waitFor%s(urlStringOrRegex) - requires a string or regex param',
      waitingFor));
}

function waitFor(stringOrRegex, waitingFor, getValue, timeout) {
  var test = createTest(stringOrRegex, waitingFor);

  var start = Date.now();
  var currentValue;
  while ((Date.now() - start) < timeout) {
    currentValue = getValue();
    if (test(currentValue)) {
      return;
    }
  }

  throw new Error(
    util.format('Timed out (%dms) waiting for %s (%j). Last value was: %j',
      timeout, waitingFor.toLowerCase(), stringOrRegex, currentValue));
}
module.exports = waitFor;
