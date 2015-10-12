'use strict';
// This is a minimal version of `testium-mocha`.
// We're trying to avoid cyclic dependencies.
import initTestium from 'testium-core';
import {once} from 'lodash';

import createDriver from '../';

var initOnce = once(initTestium);

export async function getBrowser(options) {
  const { browser } = await initOnce().then(createDriver);
  return browser;
}
