import {getBrowser} from '../mini-testium-mocha';
import assert from 'assertive';

describe('window api', () => {
  let browser;
  before(async () => (browser = await getBrowser()));

  describe('frames', () => {
    before(() => {
      browser.navigateTo('/windows.html');
      browser.assert.httpStatus(200);
    });

    it('can be switched', () => {
      browser.switchToFrame('cool-frame');
      var iframeContent = browser.getElement('.in-iframe-only').get('text');
      browser.switchToDefaultFrame();
      var primaryContent = browser.getElement('.in-iframe-only');
      assert.equal('iframe content!', iframeContent);
      assert.equal(null, primaryContent);
    });

    it('can be found when nested', () => {
      browser.switchToFrame('cool-frame');
      browser.switchToFrame('nested-frame');
      var element = browser.getElement('#nested-frame-div');
      assert.truthy('nested frame content', element);
    });
  });

  describe('popups', () => {
    before(() => {
      browser.navigateTo('/windows.html');
      browser.assert.httpStatus(200);
    });

    it('can be opened', () => {
      browser.click('#open-popup');
      browser.switchToWindow('popup1');
      var popupContent = browser.getElement('.popup-only').get('text');
      browser.closeWindow();
      browser.switchToDefaultWindow();
      var primaryContent = browser.getElement('.popup-only');
      assert.equal('popup content!', popupContent);
      assert.equal(null, primaryContent);
    });
  });
});
