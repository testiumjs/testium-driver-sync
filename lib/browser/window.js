'use strict';

var assert = require('assertive');

exports._forwarded = [
  'switchToWindow',
  'closeWindow',
];

exports.switchToDefaultFrame = function switchToDefaultFrame() {
  return this.driver.switchToFrame(null);
};

exports.switchToFrame = function switchToFrame(indexOrNameOrId) {
  assert.truthy('switchToFrame(indexOrNameOrId) - requires (Number|String) indexOrNameOrId',
    indexOrNameOrId);
  return this.driver.switchToFrame(indexOrNameOrId);
};

exports.switchToDefaultWindow = function switchToDefaultWindow() {
  assert.truthy('Attempted to locate the root window, but failed. Did you navigate to a URL first?',
    this.driver.rootWindow);
  return this.driver.switchToWindow(this.driver.rootWindow);
};
