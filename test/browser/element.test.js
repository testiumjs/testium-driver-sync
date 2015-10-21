import assert from 'assertive';
import { extend, noop } from 'lodash';

import ElementMixin from '../../lib/browser/element';

describe('element', () => {
  describe('#getElement', () => {
    const element = extend({
      driver: {
        getElement() {},
      },
    }, ElementMixin);

    it('fails if selector is undefined', () => {
      assert.throws(() => element.getElement(undefined));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() => element.getElement(noop));
    });

    it('succeeds if selector is a String', () => {
      element.getElement('.box');
    });
  });

  describe('#waitForElementVisible', () => {
    const element = extend({
      driver: {
        setElementTimeout() {},
        getElement() {
          return { isVisible() { return true; } };
        },
      },
    }, ElementMixin);

    it('fails if selector is undefined', () => {
      assert.throws(() => element.waitForElementVisible(undefined));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() => element.waitForElementVisible(noop));
    });

    it('succeeds if selector is a String', () => {
      element.waitForElementVisible('.box');
    });
  });

  describe('#waitForElementNotVisible', () => {
    const element = extend({
      driver: {
        setElementTimeout() {},
        getElement() { return { isVisible() { return false; } }; },
      },
    }, ElementMixin);

    it('fails if selector is undefined', () => {
      assert.throws(() => element.waitForElementNotVisible(undefined));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() => element.waitForElementNotVisible(noop));
    });

    it('succeeds if selector is a String', () => {
      element.waitForElementNotVisible('.box');
    });
  });

  describe('#click', () => {
    const element = extend({
      driver: {
        getElement() {
          return { click() {} };
        },
      },
    }, ElementMixin);

    it('fails if selector is undefined', () => {
      assert.throws(() => element.click(undefined));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() => element.click(noop));
    });

    it('succeeds if selector is a String', () => {
      element.click('.box');
    });
  });
});
