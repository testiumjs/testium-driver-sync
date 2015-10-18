'use strict';

var util = require('util');

var assert = require('assertive');
var _ = require('lodash');

function isTextOrRegexp(textOrRegExp) {
  return _.isString(textOrRegExp) || _.isRegExp(textOrRegExp);
}

exports._getElement = function _getElement(selector) {
  var elements = this.driver.getElements(selector);
  var count = elements.length;

  if (count === 0) {
    throw new Error('Element not found for selector: ' + selector);
  }
  if (count !== 1) {
    throw new Error(
      'assertion needs a unique selector!\n' +
      selector + ' has ' + count + ' hits in the page');
  }

  return elements[0];
};

exports.elementHasAttributes = function elementHasAttributes(doc, selector, attributesObject) {
  if (arguments.length === 2) {
    attributesObject = selector;
    selector = doc;
    doc = [
      'elementHasAttributes - selector:' + selector,
      'attributesObject:' + JSON.stringify(attributesObject),
    ].join('\n');
  } else {
    assert.hasType('elementHasAttributes(docstring, selector, attributesObject) - requires String docstring', String, doc);
  }

  assert.hasType('elementHasAttributes(selector, attributesObject) - requires String selector', String, selector);
  assert.hasType('elementHasAttributes(selector, attributesObject) - requires Object attributesObject', Object, attributesObject);

  var element = this._getElement(selector);

  _.each(attributesObject, function verifyAttribute(val, attribute) {
    var actualVal = element.get(attribute);
    var attrDoc = util.format(
      '%s\nattribute %j was expected to be %j but was %j.',
      doc, attribute, val, actualVal);

    if (_.isString(val)) {
      assert.equal(attrDoc, val, actualVal);
    } else {
      assert.hasType('elementHasAttributes(selector, attributesObject) - attributesObject requires String or RegExp value', RegExp, val);
      assert.match(attrDoc, val, actualVal);
    }
  });

  return element;
};

exports.elementHasText = function elementHasText(doc, selector, textOrRegExp) {
  if (arguments.length === 2) {
    textOrRegExp = selector;
    selector = doc;
    doc = 'elementHasText: ' + selector;
  } else {
    assert.hasType('elementHasText(docstring, selector, textOrRegExp) - requires docstring', String, doc);
  }

  assert.hasType('elementHasText(selector, textOrRegExp) - requires selector', String, selector);
  assert.truthy('elementHasText(selector, textOrRegExp) - requires textOrRegExp', isTextOrRegexp(textOrRegExp));

  var element = this._getElement(selector);
  var actualText = element.get('text');

  if (textOrRegExp === '') {
    assert.equal(textOrRegExp, actualText);
  } else {
    assert.include(doc, textOrRegExp, actualText);
  }

  return element;
};

exports.elementLacksText = function elementLacksText(doc, selector, textOrRegExp) {
  if (arguments.length === 2) {
    textOrRegExp = selector;
    selector = doc;
    doc = 'elementLacksText: ' + selector;
  } else {
    assert.hasType('elementLacksText(docstring, selector, textOrRegExp) - requires docstring', String, doc);
  }

  assert.hasType('elementLacksText(selector, textOrRegExp) - requires selector', String, selector);
  assert.truthy('elementLacksText(selector, textOrRegExp) - requires textOrRegExp', isTextOrRegexp(textOrRegExp));

  var element = this._getElement(selector);
  var actualText = element.get('text');

  assert.notInclude(doc, textOrRegExp, actualText);
  return element;
};

exports.elementHasValue = function elementHasValue(doc, selector, textOrRegExp) {
  if (arguments.length === 2) {
    textOrRegExp = selector;
    selector = doc;
    doc = 'elementHasValue: ' + selector;
  } else {
    assert.hasType('elementHasValue(docstring, selector, textOrRegExp) - requires docstring', String, doc);
  }

  assert.hasType('elementHasValue(selector, textOrRegExp) - requires selector', String, selector);
  assert.truthy('elementHasValue(selector, textOrRegExp) - requires textOrRegExp', isTextOrRegexp(textOrRegExp));

  var element = this._getElement(selector);
  var actualValue = element.get('value');

  if (textOrRegExp === '') {
    assert.equal(textOrRegExp, actualValue);
  } else {
    assert.include(doc, textOrRegExp, actualValue);
  }

  return element;
};

exports.elementLacksValue = function elementLacksValue(doc, selector, textOrRegExp) {
  if (arguments.length === 2) {
    textOrRegExp = selector;
    selector = doc;
    doc = 'elementLacksValue: ' + selector;
  } else {
    assert.hasType('elementLacksValue(docstring, selector, textOrRegExp) - requires docstring', String, doc);
  }

  assert.hasType('elementLacksValue(selector, textOrRegExp) - requires selector', String, selector);
  assert.truthy('elementLacksValue(selector, textOrRegExp) - requires textOrRegExp', isTextOrRegexp(textOrRegExp));

  var element = this._getElement(selector);
  var actualValue = element.get('value');

  assert.notInclude(doc, textOrRegExp, actualValue);
  return element;
};

exports.elementIsVisible = function elementIsVisible(selector) {
  assert.hasType('elementIsVisible(selector) - requires (String) selector', String, selector);
  var element = this.browser.getElementWithoutError(selector);
  assert.truthy('Element not found for selector: ' + selector, element);
  assert.truthy('Element should be visible for selector: ' + selector, element.isVisible());
  return element;
};

exports.elementNotVisible = function elementNotVisible(selector) {
  assert.hasType('elementNotVisible(selector) - requires (String) selector', String, selector);
  var element = this.browser.getElementWithoutError(selector);
  assert.truthy('Element not found for selector: ' + selector, element);
  assert.falsey('Element should not be visible for selector: ' + selector, element.isVisible());
  return element;
};

exports.elementExists = function elementExists(selector) {
  assert.hasType('elementExists(selector) - requires (String) selector', String, selector);
  var element = this.browser.getElementWithoutError(selector);
  assert.truthy('Element not found for selector: ' + selector, element);
  return element;
};

exports.elementDoesntExist = function elementDoesntExist(selector) {
  assert.hasType('elementDoesntExist(selector) - requires (String) selector', String, selector);
  var element = this.browser.getElementWithoutError(selector);
  assert.falsey('Element found for selector: ' + selector, element);
};
