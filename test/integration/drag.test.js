import {getBrowser} from '../mini-testium-mocha';
import assert from 'assertive';
import {pick} from 'lodash';

describe('draggable element', () => {
  let browser;
  before(async () => (browser = await getBrowser()));

  it('is moved', () => {
    browser.navigateTo('/draggable.html');
    browser.assert.httpStatus(200);
    const box = browser.getElement('#box');
    assert.truthy('#box is in page', box);
    assert.deepEqual({ x: 0, y: 0 },
      pick(box.getLocation(), 'x', 'y'));
    box.movePointerRelativeTo(0, 0);
    browser.buttonDown();
    box.movePointerRelativeTo(100, 100);
    browser.buttonUp();
    assert.deepEqual({ x: 100, y: 100 },
      pick(box.getLocation(), 'x', 'y'));
  });
});
