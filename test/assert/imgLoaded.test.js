import assert from 'assertive';
import { extend, noop } from 'lodash';

import ImgLoadedMixin from '../../lib/assert/imgLoaded';

describe('imgLoaded', () => {
  const context = extend({
    browser: {
      evaluate() { return true; },
    },
  }, ImgLoadedMixin);

  it('fails if selector is undefined', () => {
    assert.throws(() => context.imgLoaded(undefined));
  });

  it('fails if selector is not a String', () => {
    assert.throws(() => context.imgLoaded(noop));
  });

  it('succeeds if all conditions are met', () => {
    context.imgLoaded('.thumb');
  });
});
