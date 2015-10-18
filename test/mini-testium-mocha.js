// This is a minimal version of `testium-mocha`.
// We're trying to avoid cyclic dependencies.
import initTestium from 'testium-core';
import {once} from 'lodash';

import createDriver from '../';

let browser = null;

async function createBrowser() {
  const testium = await initTestium().then(createDriver);
  browser = testium.browser;
  return browser;
}

after(() => browser && browser.close());

export const getBrowser = once(createBrowser);
