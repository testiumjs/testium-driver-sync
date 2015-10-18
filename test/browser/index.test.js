import assert from 'assertive';
import { noop } from 'lodash';

import Browser from '../../lib/browser';

class FakeWebDriver {
  navigateTo() {}
  getUrl() {}
  getCurrentWindowHandle() {}
  clearCookies() {}
  setPageSize() {}
}

describe('API', () => {
  describe('construction', () => {
    var driver = new FakeWebDriver();
    var targetUrl = 'http://127.0.0.1:1000';
    var commandUrl = 'http://127.0.0.1:2000';

    it('fails if driver is undefined', () => {
      assert.throws(() =>
        new Browser(undefined, {targetUrl, commandUrl}));
    });

    it('fails if driver is not an object', () => {
      assert.throws(() =>
        new Browser('Not a driver', {targetUrl, commandUrl}));
    });

    it('succeeds if all conditions are met', () => {
      new Browser(driver);
    });
  });

  describe('#evaluate', () => {
    it('fails if clientFunction is undefined', () => {
      var err = assert.throws(() =>
        Browser.prototype.evaluate.call({}, undefined));
      assert.include('requires (Function|String) clientFunction', err.message);
    });

    it('fails if clientFunction is not a Function or String', () => {
      var err = assert.throws(() =>
        Browser.prototype.evaluate.call({}, 999));
      assert.include('requires (Function|String) clientFunction', err.message);
    });

    it('succeeds if all conditions are met', done => {
      var dummyContext = {
        driver: { evaluate() { done(); } }
      };
      Browser.prototype.evaluate.call(dummyContext, noop);
    });
  });
});
