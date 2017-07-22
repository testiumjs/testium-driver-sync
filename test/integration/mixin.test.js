import { getBrowser } from '../mini-testium-mocha';
import assert from 'assertive';

describe('mixin', () => {
  let browser;
  before(async () => (browser = await getBrowser()));

  it('exposes the relative path mixed-in method', () => {
    assert.equal(10, browser.mixedInMethod());
  });

  it('exposes the external module mixed-in method', () => {
    assert.equal(42, browser.anotherMethod());
  });
});
