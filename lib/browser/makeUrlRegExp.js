'use strict';

var _ = require('lodash');

// TODO: Figure out if there's a non-regex way to achieve the same,
// e.g. by comparing parsed urls.

function quoteRegExp(string) {
  return string.replace(/[-\\\/\[\]{}()*+?.^$|]/g, '\\$&');
}

function bothCases(alpha) {
  var dn, up;
  up = alpha.toUpperCase();
  dn = alpha.toLowerCase();
  return "[" + up + dn + "]";
}

var isHexaAlphaRE = /[a-f]/gi;
function matchCharacter(uriEncoded, hex) {
  var codepoint = parseInt(hex, 16);
  var character = String.fromCharCode(codepoint);
  character = quoteRegExp(character);
  if (character === ' ') {
    character += '|\\+';
  }
  return "(?:" + uriEncoded.replace(isHexaAlphaRE, bothCases) + "|" + character + ")";
}

var encodedCharRE = /%([0-9a-f]{2})/gi;
function matchURI(stringOrRegExp) {
  if (_.isRegExp(stringOrRegExp)) {
    return stringOrRegExp.toString().replace(/^\/|\/\w*$/g, '');
  }

  var fullyEncoded = encodeURIComponent(stringOrRegExp);
  return quoteRegExp(fullyEncoded).replace(encodedCharRE, matchCharacter);
}

function makeUrlRegExp(url, query) {
  var expr = matchURI(url);
  _.each(query || {}, function(val, key) {
    key = matchURI(key);
    val = matchURI(val);
    expr += "(?=(?:\\?|.*&)" + key + "=" + val + ")";
  });
  return new RegExp(expr);
}
module.exports = makeUrlRegExp;
