import {getBrowser} from '../../mini-testium-mocha';
import assert from 'assertive';

describe('imgLoaded', () => {
  let browser;
  before(async () => (browser = await getBrowser()));

  before(() => browser.navigateTo('/'));

  it('throws an error when the image was not found', () => {
    var msg = 'imgLoaded "img.not-in-the-page": element not found';
    var err = assert.throws(() => browser.assert.imgLoaded('img.not-in-the-page'));
    assert.include(msg, err.message);
  });

  it('throws an error for non-unique selectors when finding multiple images', () => {
    var msg = 'imgLoaded "img[alt][class]": non-unique selector; count: 3';
    var err = assert.throws(() => browser.assert.imgLoaded('img[alt][class]'));
    assert.include(msg, err.message);
  });

  it('throws an error for an image not successfully loaded / decoded', () => {
    var msg = 'imgLoaded "img.fail": failed to load ';
    var err = assert.throws(() => browser.assert.imgLoaded('img.fail'));
    assert.include(msg, err.message);
    assert.include('/non-existent-image.jpg', err.message);
  });

  it('throws a helpful error for an <img> missing the src attribute', () => {
    var msg = 'imgLoaded "#no": failed to load src-less img#no.src.dude';
    var err = assert.throws(() => browser.assert.imgLoaded('#no'));
    assert.include(msg, err.message);
  });

  it('throws a helpful error when the selector did not match an <img> tag', () => {
    var msg = 'imgLoaded "body": failed to load non-image body';
    var err = assert.throws(() => browser.assert.imgLoaded('body'));
    assert.include(msg, err.message);
  });

  it('does nothing when the image was successfully loaded and decoded', () => {
    browser.assert.imgLoaded('img.okay');
  });
});
