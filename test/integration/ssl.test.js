import {getBrowser} from '../mini-testium-mocha';
import assert from 'assertive';

describe('ssl/tls', () => {
  let browser;
  before(async () => (browser = await getBrowser()));

  it('TLS is supported', () => {
    browser.navigateTo('https://www.howsmyssl.com/a/check');
    var raw = browser.getExistingElement('pre').get('text');
    var sslReport = JSON.parse(raw);
    assert.match(/^TLS/, sslReport.tls_version);
  });
});
