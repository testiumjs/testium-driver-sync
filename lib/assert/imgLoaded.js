'use strict';

var assert = require('assertive');
var imgLoadedFn = require('./imgLoaded_client');
var _ = require('lodash');

exports.imgLoaded = function imgLoaded(doc, selector) {
  if (arguments.length === 1) {
    selector = doc;
    doc = undefined;
  }
  assert.hasType('imgLoaded(selector) - requires (String) selector', String, selector);

  var result = this.browser.evaluate(selector, imgLoadedFn);
  if (result === true) {
    return;
  }

  function fail(help) {
    var message = 'imgLoaded ' + JSON.stringify(selector) + ': ' + help;
    if (doc) {
      message = doc + '\n' + message;
    }
    throw new Error(message);
  }

  if (result === 0) {
    fail('element not found');
  } else if (_.isNumber(result)) {
    fail('non-unique selector; count: ' + result);
  } else {
    fail('failed to load ' + result);
  }
};
