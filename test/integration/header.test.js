import {getBrowser} from '../mini-testium-mocha';
import assert from 'assertive';

describe('header', () => {
  let browser;
  before(async () => (browser = await getBrowser()));

  describe('can be retireved', () => {
    before(() => {
      browser.navigateTo('/');
      browser.assert.httpStatus(200);
    });

    it('as a group', () => {
      var headers = browser.getHeaders();
      var contentType = headers['content-type'];
      assert.equal('text/html', contentType);
    });

    it('individually', () => {
      var contentType = browser.getHeader('content-type');
      assert.equal('text/html', contentType);
    });
  });

  describe('can be set', () => {
    before(() =>
      browser.navigateTo('/echo', { headers: { 'x-something': 'that place' } }));

    it('to new values', () => {
      var source = browser.getElement('body').get('text');
      var body = JSON.parse(source);
      assert.equal(body.headers['x-something'], 'that place');
    });
  });
});
