// This is a minimal version of `testium-mocha`.
// We're trying to avoid cyclic dependencies.
import TestiumCore from 'testium-core';

import createDriver from '../';

let browser = null;

export async function getBrowser() {
  browser = await TestiumCore.getBrowser({ driver: createDriver });
  return browser;
}

after(() => browser && browser.close());
