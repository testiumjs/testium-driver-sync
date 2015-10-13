import {getBrowser} from '../mini-testium-mocha';
import assert from 'assertive';

describe('unicode support', () => {
  let browser;
  before(async () => (browser = await getBrowser()));

  before(() => browser.navigateTo('/'));

  it('multibyte unicode can pass through and back from WebDriver', () => {
    var multibyteText = '日本語 text';
    var element = browser.getElement('#blank-input');
    element.type(multibyteText);
    var result = element.get('value');
    assert.equal(result, multibyteText);
  });
});
