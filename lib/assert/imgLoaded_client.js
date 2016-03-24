/*
 * Copyright (c) 2015, Groupon, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of GROUPON nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
  var img = imgs[0];

  if (!img.src) {
    if ((img.tagName || '').match(/^img$/i)) {
      return 'src-less ' + describe(img);
    }
    return 'non-image ' + describe(img);
  }

  return img.complete && img.naturalWidth ? true : img.src;
};
