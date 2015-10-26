'use strict';

var util = require('util');

var assert = require('assertive');
var _ = require('lodash');

var STALE_MESSAGE = /stale element reference/;

function visiblePredicate(shouldBeVisible, element) {
  return element && element.isVisible() === shouldBeVisible;
}

function visibleFailure(shouldBeVisible, selector, timeout) {
  throw new Error(util.format('Timeout (%dms) waiting for element (%s) to %sbe visible.',
    timeout, selector, shouldBeVisible ? '' : 'not '));
}

// Curry some functions for later use
var isVisiblePredicate = _.partial(visiblePredicate, true);
var isntVisiblePredicate = _.partial(visiblePredicate, false);

var isVisibleFailure = _.partial(visibleFailure, true);
var isntVisibleFailure = _.partial(visibleFailure, false);

function elementExistsPredicate(shouldBeVisible, element) {
  return !!element === shouldBeVisible;
}

function elementExistsFailure(shouldBeVisible, selector, timeout) {
  throw new Error(util.format('Timeout (%dms) waiting for element (%s) %sto exist in page.',
    timeout, selector, shouldBeVisible ? '' : 'not '));
}

var elementDoesExistPredicate = _.partial(elementExistsPredicate, true);
var elementDoesNotExistPredicate = _.partial(elementExistsPredicate, false);

var elementDoesExistFailure = _.partial(elementExistsFailure, true);
var elementDoesNotExistFailure = _.partial(elementExistsFailure, false);

exports._forwarded = [
  // TODO: port type assertion for selector to webdriver-http-sync
  'getElements',
];

exports.getElementOrNull = function getElementOrNull(selector) {
  // TODO: part typeof selector === string check to webdriver-http-sync
  assert.hasType('`selector` as to be a String', String, selector);
  return this.driver.getElement(selector);
};

var warnAboutFutureException = util.deprecate(_.noop, [
  'WARNING:',
  'getElement was used with a selector that doesn\'t match an element.',
  'Use getElementOrNull if that\'s expected.',
  'In future versions of testium-driver-sync, getElement will throw.',
].join('\n'));

exports.getElement = function getElement(selector) {
  var element = this.getElementOrNull(selector);
  if (element === null) {
    warnAboutFutureException();
  }
  return element;
};

exports.getExistingElement = function getExistingElement(selector) {
  var element = this.getElementOrNull(selector);
  assert.truthy('Element not found at selector: ' + selector, element);
  return element;
};

exports.waitForElementVisible = function waitForElementVisible(selector, timeout) {
  return this._waitForElement(selector, isVisiblePredicate, isVisibleFailure, timeout);
};

exports.waitForElementNotVisible = function waitForElementNotVisible(selector, timeout) {
  return this._waitForElement(selector, isntVisiblePredicate, isntVisibleFailure, timeout);
};

exports.waitForElementExist = function waitForElementExist(selector, timeout) {
  return this._waitForElement(selector,
    elementDoesExistPredicate, elementDoesExistFailure, timeout);
};

exports.waitForElementNotExist = function waitForElementNotExist(selector, timeout) {
  return this._waitForElement(selector,
    elementDoesNotExistPredicate, elementDoesNotExistFailure, timeout);
};

exports.click = function click(selector) {
  return this.getExistingElement(selector).click();
};

function tryFindElement(self, selector, predicate, untilTime) {
  var element;

  while (Date.now() < untilTime) {
    element = self.getElementOrNull(selector);

    try {
      if (predicate(element)) {
        return element;
      }
    } catch (exception) {
      // Occasionally webdriver throws an error about the element reference being
      // stale.  Let's handle that case as the element doesn't yet exist. All
      // other errors are re thrown.
      if (!STALE_MESSAGE.test(exception.toString())) {
        throw exception;
      }
    }
  }
  return false;
}

// Where predicate takes a single parameter which is an element (or null) and
// returns true when the wait is over
exports._waitForElement = function _waitForElement(selector, predicate, failure, timeout) {
  assert.hasType('`selector` as to be a String', String, selector);
  timeout = timeout || 3000;

  this.driver.setElementTimeout(timeout);
  var foundElement = tryFindElement(this, selector, predicate, Date.now() + timeout);
  this.driver.setElementTimeout(0);

  if (foundElement === false) {
    return failure(selector, timeout);
  }

  return foundElement;
};
