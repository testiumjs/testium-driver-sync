import {getBrowser} from '../mini-testium-mocha';
import assert from 'assertive';

describe('evaluate', () => {
  let browser;
  before(async () => (browser = await getBrowser()));

  before(() => {
    browser.navigateTo('/');
    browser.assert.httpStatus(200);
  });

  it('can get an input\'s value', () => {
    var element = browser.getElement('#text-input');
    var value = element.get('value');
    assert.equal('Input value was not found', 'initialvalue', value);
  });

  it('can clear an input\'s value', () => {
    var element = browser.getElement('#text-input');
    element.clear();
    var value = element.get('value');
    assert.equal('Input value was not cleared', '', value);
  });

  it('can type into an input', () => {
    var element = browser.getElement('#text-input');
    element.type('new stuff');
    var value = element.get('value');
    assert.equal('Input value was not typed', 'new stuff', value);
  });

  it('can replace the input\'s value', () => {
    var element = browser.getElement('#text-input');
    var value = element.get('value');
    assert.notEqual('Input value is already empty', '', value);
    browser.clearAndType('#text-input', 'new stuff2');
    value = element.get('value');
    assert.equal('Input value was not typed', 'new stuff2', value);
  });

  it('can get a textarea\'s value', () => {
    var element = browser.getElement('#text-area');
    var value = element.get('value');
    assert.equal('Input value was not found', 'initialvalue', value);
  });

  it('can clear an textarea\'s value', () => {
    var element = browser.getElement('#text-area');
    element.clear();
    var value = element.get('value');
    assert.equal('Input value was not cleared', '', value);
  });

  it('can type into a textarea', () => {
    var element = browser.getElement('#text-area');
    element.type('new stuff');
    var value = element.get('value');
    assert.equal('Input value was not typed', 'new stuff', value);
  });
});
