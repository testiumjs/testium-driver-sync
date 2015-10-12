'use strict';

var util = require('util');

var assert = require('assertive');
var _ = require('lodash');

var STALE_MESSAGE = /stale element reference/;

var NOT_FOUND_MESSAGE = new RegExp([
  'Unable to locate element', // firefox message
  'Unable to find element', // phantomjs message
  'no such element', // chrome message 
].join('|'));

function visiblePredicate(shouldBeVisible, element) {
  return element && element.isVisible() === shouldBeVisible;
}

function visibleFailure(shouldBeVisible, selector, timeout) {
  throw new Error(util.format('Timeout (%dms) waiting for element (%s) to %sbe visible.',
    timeout, selector, shouldBeVisible ? '' : 'not '));
}

function elementExistsPredicate(element) {
  return !!element;
}

function elementExistsFailure(selector, timeout) {
  throw new Error(util.format('Timeout (%dms) waiting for element (%s) to exist in page.',
    timeout, selector));
}

// Curry some functions for later use
var isVisiblePredicate = _.partial(visiblePredicate, true);
var isntVisiblePredicate = _.partial(visiblePredicate, false);

var isVisibleFailure = _.partial(visibleFailure, true);
var isntVisibleFailure = _.partial(visibleFailure, false);

exports._forwarded = [
  // TODO: port type assertion for selector to webdriver-http-sync
  'getElements'
];

exports.getElementWithoutError = function getElementWithoutError(selector) {
  // TODO: part typeof selector === string check to webdriver-http-sync
  assert.hasType('`selector` as to be a String', String, selector);
  try {
    return this.driver.getElement(selector);
  } catch (exception) {
    var message = exception.toString();

    if (NOT_FOUND_MESSAGE.test(message)) {
      return null;
    }

    throw exception;
  }
};

exports.getElement = exports.getElementWithoutError;

exports.getExistingElement = function getExistingElement(selector) {
  var element = this.getElement(selector);
  assert.truthy('Element not found at selector: ' + selector, element);
  return element;
};

exports.waitForElementVisible = function waitForElementVisible(selector, timeout) {
  return this._waitForElement(selector, isVisiblePredicate, isVisibleFailure, timeout);
};

exports.waitForElementNotVisible = function waitForElementNotVisible(selector, timeout) {
  return this._waitForElement(selector, isntVisiblePredicate, isntVisibleFailure, timeout);
}

exports.waitForElementExist = function waitForElementExist(selector, timeout) {
  return this._waitForElement(selector, elementExistsPredicate, elementExistsFailure, timeout);
}

exports.click = function click(selector) {
  return this.getExistingElement(selector).click();
};

function tryFindElement(self, selector, predicate, untilTime) {
  var element, predicateResult;

  while (Date.now() < untilTime) {
    element = self.getElementWithoutError(selector);

    try {
      predicateResult = predicate(element);
    } catch (exception) {
      // Occasionally webdriver throws an error about the element reference being
      // stale.  Let's handle that case as the element doesn't yet exist. All
      // other errors are re thrown.
      if (!STALE_MESSAGE.test(exception.toString())) {
        throw exception;
      }
    }

    if (predicateResult) {
      return element;
    }
  }
  return null;
}

// Where predicate takes a single parameter which is an element (or null) and
// returns true when the wait is over
exports._waitForElement = function _waitForElement(selector, predicate, failure, timeout) {
  assert.hasType('`selector` as to be a String', String, selector);
  timeout = timeout || 3000;

  this.driver.setElementTimeout(timeout);
  var foundElement = tryFindElement(this, selector, predicate, Date.now() + timeout);
  this.driver.setElementTimeout(0);

  if (foundElement === null) {
    return failure(selector, timeout);
  }

  return foundElement;
};
