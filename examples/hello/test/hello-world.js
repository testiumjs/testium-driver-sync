'use strict';

import {test} from 'babel-tap';
import initTestium from 'testium-core';

import createDriver from '../../..';

test('Load example page', async t => {
  const { browser } = await initTestium().then(createDriver);

  browser.navigateTo('/ok');
  t.equal(browser.getPageTitle(), 'ok', 'has the correct title');
});
