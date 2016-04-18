import assert from 'assertive';
import { extend, noop } from 'lodash';

import ElementMixin from '../../lib/assert/element';

describe('assert/element', () => {
  describe('#elementHas', () => {
    const selector = '.box';
    const text = 'something';
    const element = extend({
      driver: {
        getElements() {
          return [{ get() { return text; } }];
        },
      },
    }, ElementMixin);

    describe('Attributes', () => {
      const attributesObject = {
        text,
        value: text,
        id: /something/,
      };

      it('fails if selector is undefined', () => {
        assert.throws(() =>
          element.elementHasAttributes(undefined, attributesObject));
      });

      it('fails if selector is not a string', () => {
        assert.throws(() =>
          element.elementHasAttributes(999, attributesObject));
      });

      it('returns the element if all conditions are met', () => {
        assert.truthy(element.elementHasAttributes(selector, attributesObject));
      });
    });

    describe('Text', () => {
      it('fails if selector is undefined', () => {
        assert.throws(() =>
          element.elementHasText(undefined, text));
      });

      it('fails if selector is not a String', () => {
        assert.throws(() =>
          element.elementHasText(999, text));
      });

      it('fails if text is undefined', () => {
        assert.throws(() =>
          element.elementHasText(selector, undefined));
      });

      it('returns the element if all conditions are met', () => {
        assert.truthy(element.elementHasText(selector, text));
      });
    });

    describe('Value', () => {
      it('fails if selector is undefined', () => {
        assert.throws(() =>
          element.elementHasValue(undefined, text));
      });

      it('fails if selector is not a String', () => {
        assert.throws(() =>
          element.elementHasValue(999, text));
      });

      it('fails if text is undefined', () => {
        assert.throws(() =>
          element.elementHasValue(selector, undefined));
      });

      it('returns the element if all conditions are met', () => {
        assert.truthy(element.elementHasValue(selector, text));
      });
    });
  });

  describe('#elementLacks', () => {
    const selector = '.box';
    const text = 'something';
    const element = extend({
      driver: {
        getElements() { return [{ get() { return 'else'; } }]; },
      },
    }, ElementMixin);

    describe('Text', () => {
      it('fails if selector is undefined', () => {
        assert.throws(() =>
          element.elementLacksText(undefined, text));
      });

      it('fails if selector is not a String', () => {
        assert.throws(() =>
          element.elementLacksText(999, text));
      });

      it('fails if text is undefined', () => {
        assert.throws(() =>
          element.elementLacksText(selector, undefined));
      });

      it('returns the element if all conditions are met', () => {
        assert.truthy(element.elementLacksText(selector, text));
      });
    });

    describe('Value', () => {
      it('fails if selector is undefined', () => {
        assert.throws(() =>
          element.elementLacksValue(undefined, text));
      });

      it('fails if selector is not a String', () => {
        assert.throws(() =>
          element.elementLacksValue(999, text));
      });

      it('fails if text is undefined', () => {
        assert.throws(() =>
          element.elementLacksValue(selector, undefined));
      });

      it('returns the element if all conditions are met', () => {
        assert.truthy(element.elementLacksValue(selector, text));
      });
    });
  });

  describe('#elementIsVisible', () => {
    const element = extend({
      browser: {
        getElementOrNull() {
          return { isVisible() { return true; } };
        },
      },
    }, ElementMixin);

    it('fails if selector is undefined', () => {
      assert.throws(() =>
        element.elementIsVisible(undefined));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() =>
        element.elementIsVisible(noop));
    });

    it('returns the element if all conditions are met', () => {
      assert.truthy(element.elementIsVisible('.box'));
    });
  });

  describe('#elementNotVisible', () => {
    const element = extend({
      browser: {
        getElementOrNull() {
          return { isVisible() { return false; } };
        },
      },
    }, ElementMixin);

    it('fails if selector is undefined', () => {
      assert.throws(() =>
        element.elementNotVisible(undefined));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() =>
        element.elementNotVisible(noop));
    });

    it('returns the element if all conditions are met', () => {
      assert.truthy(element.elementNotVisible('.box'));
    });
  });

  describe('#elementExists', () => {
    const element = extend({
      browser: {
        getElementOrNull() { return {}; },
      },
    }, ElementMixin);

    it('fails if selector is undefined', () => {
      assert.throws(() =>
        element.elementExists(undefined));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() =>
        element.elementExists(noop));
    });

    it('returns the element if all conditions are met', () => {
      assert.truthy(element.elementExists('.box'));
    });
  });

  describe('#elementDoesntExist', () => {
    const element = extend({
      browser: {
        getElementOrNull() { return null; },
      },
    }, ElementMixin);

    it('fails if selector is undefined', () => {
      assert.throws(() =>
        element.elementDoesntExist(undefined));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() =>
        element.elementDoesntExist(noop));
    });

    it('succeeds if all conditions are met', () => {
      element.elementDoesntExist('.box');
    });
  });
});
