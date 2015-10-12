'use strict';

var assert = require('assertive');

exports.httpStatus = function httpStatus(expectedStatus) {
  assert.hasType('assert.httpStatus(status) - requires (Number) status', Number, expectedStatus);
  var actualStatus = this.browser.getStatusCode();
  assert.equal('statuscode', expectedStatus, actualStatus);
};
