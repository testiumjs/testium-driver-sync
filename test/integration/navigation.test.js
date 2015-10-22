import {getBrowser} from '../mini-testium-mocha';
import assert from 'assertive';

describe('navigation', () => {
  let browser;
  before(async () => (browser = await getBrowser()));

  it('supports just a path', () => {
    browser.navigateTo('/');
    assert.equal(200, browser.getStatusCode());
  });

  it('supports query args', () => {
    browser.navigateTo('/', { query: { 'a b': 'München', x: 0 } });
    assert.equal(200, browser.getStatusCode());

    browser.waitForPath('/?a%20b=M%C3%BCnchen&x=0', 100);
  });

  it('with a query string and query arg', () => {
    browser.navigateTo('/?x=0', { query: { 'a b': 'München' } });
    assert.equal(200, browser.getStatusCode());

    browser.waitForPath('/?x=0&a%20b=M%C3%BCnchen', 100);
  });

  it('by clicking a link', () => {
    browser.navigateTo('/');
    assert.equal(200, browser.getStatusCode());

    browser.click('.link-to-other-page');
    assert.equal('/other-page.html', browser.getPath());
  });

  it('by refreshing', () => {
    browser.navigateTo('/');
    assert.equal(200, browser.getStatusCode());

    browser.evaluate(function changePage() {
      /* eslint no-var:0 */
      var el = document.createElement('div');
      el.className = 'exists-before-refresh';
      document.body.appendChild(el);
    });
    // Making sure the element exists
    browser.assert.elementExists('.exists-before-refresh');

    browser.refresh();
    // The element should now be gone.
    browser.assert.elementDoesntExist('.exists-before-refresh');
  });

  describe('waiting for a url', () => {
    it('can work with a string', () => {
      browser.navigateTo('/redirect-after.html');
      assert.equal(200, browser.getStatusCode());

      browser.waitForPath('/index.html');
    });

    it('can work with a regex', () => {
      browser.navigateTo('/redirect-after.html');
      assert.equal(200, browser.getStatusCode());

      browser.waitForUrl(/\/index.html/);
    });

    it('can fail', () => {
      browser.navigateTo('/index.html');
      assert.equal(200, browser.getStatusCode());

      const error = assert.throws(() => browser.waitForUrl('/some-random-place.html', 5));
      const expectedError = /^Timed out \(5ms\) waiting for url \("\/some-random-place\.html"\)\. Last value was: "http:\/\/127\.0\.0\.1:[\d]+\/index\.html"$/;
      assert.match(expectedError, error.message);
    });

    describe('groks url and query object', () => {
      it('can make its own query regexp', () => {
        browser.navigateTo('/redirect-to-query.html');
        browser.waitForUrl('/index.html', {
          'a b': 'A B',
          c: '1,7',
        });
        assert.equal(200, browser.getStatusCode());
      });

      it('can find query arguments in any order', () => {
        browser.navigateTo('/redirect-to-query.html');
        browser.waitForUrl('/index.html', {
          c: '1,7',
          'a b': 'A B',
        });
      });

      it('can handle regexp query arguments', () => {
        browser.navigateTo('/redirect-to-query.html');
        browser.waitForUrl('/index.html', {
          c: /[\d,]+/,
          'a b': 'A B',
        });
      });

      it('detects non-matches too', () => {
        browser.navigateTo('/redirect-to-query.html');

        const error = assert.throws(() => browser.waitForUrl('/index.html', { no: 'q' }, 200));
        assert.match(/Timed out .* waiting for url/, error.message);
      });
    });
  });

  describe('waiting for a path', () => {
    it('can work with a string', () => {
      browser.navigateTo('/redirect-after.html');
      assert.equal(200, browser.getStatusCode());

      browser.waitForPath('/index.html');
    });

    it('can work with a regex', () => {
      browser.navigateTo('/redirect-after.html');
      assert.equal(200, browser.getStatusCode());

      browser.waitForPath(/index.html/);
    });
  });
});
