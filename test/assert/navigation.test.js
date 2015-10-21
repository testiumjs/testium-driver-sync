import assert from 'assertive';
import { extend } from 'lodash';

import NavigationMixin from '../../lib/assert/navigation';

describe('assert.navigations', () => {
  const context = extend({
    browser: {
      getStatusCode() { return 200; },
    },
  }, NavigationMixin);

  it('fails if expectedStatus is undefined', () => {
    assert.throws(() => context.httpStatus(undefined));
  });

  it('fails if expectedStatus is not a number', () => {
    assert.throws(() => context.httpStatus('200'));
  });

  it('succeeds if expectedStatus is a number', () => {
    context.httpStatus(200);
  });
});
