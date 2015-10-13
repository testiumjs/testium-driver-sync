'use strict';

// returns true if the image is loaded and decoded,
// or a number, if it didn't find one single image,
// or a helpful error if it wasn't an image,
// or the path, if it found some non-loaded image
module.exports = function imgLoaded(selector) {
  function describe(elem) {
    var tag = (elem.tagName || '').toLowerCase();
    if (elem.id) {
      tag += '#' + elem.id;
    }
    var classes = elem.className.replace(/^\s+|\s+$/g, '');
    if (classes) {
      tag += '.' + classes.replace(/\s+/g, '.');
    }
    return tag;
  }

  var imgs = document.querySelectorAll(selector);
  if (imgs.length !== 1) {
    return imgs.length;
  }
  img = imgs[0];

  if (!img.src) {
    var oops = describe(img);
    if ((img.tagName || '').match(/^img$/i)) {
      return 'src-less ' + describe(img);
    } else {
      return 'non-image ' + describe(img);
    }
  }

  return img.complete && img.naturalWidth ? true : img.src;
};
