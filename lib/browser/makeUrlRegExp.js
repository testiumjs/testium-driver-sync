/*
 * Copyright (c) 2015, Groupon, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of GROUPON nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
'use strict';

var _ = require('lodash');

// TODO: Figure out if there's a non-regex way to achieve the same,
// e.g. by comparing parsed urls.

function quoteRegExp(string) {
  return string.replace(/[-\\\/\[\]{}()*+?.^$|]/g, '\\$&');
}

function bothCases(alpha) {
  var up = alpha.toUpperCase();
  var dn = alpha.toLowerCase();
  return '[' + up + dn + ']';
}

var isHexaAlphaRE = /[a-f]/gi;
function matchCharacter(uriEncoded, hex) {
  var codepoint = parseInt(hex, 16);
  var character = String.fromCharCode(codepoint);
  character = quoteRegExp(character);
  if (character === ' ') {
    character += '|\\+';
  }
  return '(?:' + uriEncoded.replace(isHexaAlphaRE, bothCases) + '|' + character + ')';
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
  _.each(query || {}, function queryParamMatcher(val, key) {
    key = matchURI(key);
    val = matchURI(val);
    expr += '(?=(?:\\?|.*&)' + key + '=' + val + ')';
  });
  return new RegExp(expr);
}
module.exports = makeUrlRegExp;
