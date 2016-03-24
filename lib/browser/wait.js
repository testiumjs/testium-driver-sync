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
