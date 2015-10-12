'use strict';

var assert = require('assertive');
var _ = require('lodash');

exports.clear = function clear(selector) {
  assert.hasType('clear(selector) - requires (String) selector', String, selector);
  return this.getExistingElement(selector).clear();
};

exports.type = function type(selector) {
  var keys = _.toArray(arguments).slice(1);
  assert.hasType('type(selector, ...keys) - requires (String) selector', String, selector);
  assert.truthy('type(selector, ...keys) - requires keys', keys.length > 0);
  var element = this.getExistingElement(selector);
  return element.type.apply(element, keys);
};

exports.setValue = function setValue(selector) {
  var keys = _.toArray(arguments).slice(1);
  assert.hasType('setValue(selector, ...keys) - requires (String) selector', String, selector);
  assert.truthy('setValue(selector, ...keys) - requires keys', keys.length > 0);

  var element = this.getExistingElement(selector);
  element.clear();
  return element.type.apply(element, keys);
};
exports.clearAndType = exports.setValue;
