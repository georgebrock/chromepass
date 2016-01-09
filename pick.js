/*

A fuse.js compatible port of pickgtk's fuzzy find algorithm.

pickgtk can be found at https://github.com/thoughtbot/pickgtk, and is released
under the following license:

Copyright (c) 2015 thoughtbot <hello@thoughtbot.com>

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

function Pick(query, options) {
  this.query = query;
}
Pick.prototype.search = function (str) {
  var score = this._score(str);

  return {
    isMatch: (score != 0),
    score: score
  }
};
Pick.prototype._score = function (str) {
  var slen, qlen, mlen;

  slen = str.length;
  qlen = this.query.length;

  if (qlen == 0) {
    return 1.0;
  }

  mlen = this._minMatchLen(str);
  if (mlen == 0) {
    return 0.0;
  }

  return qlen / mlen / slen;
};
Pick.prototype._minMatchLen = function (str) {
  var i, min = 0, len;

  for (i = 0; i < str.length; i += 1) {
    len = this._matchLen(str, this.query, 0, 0);

    if (len == 0) {
      return min;
    }

    if (min == 0 || min > len) {
      min = len;
    }
  }

  return min;
};
Pick.prototype._matchLen = function (str, query, acc, incr) {
  if (query == '') {
    return acc;
  }

  if (str == '') {
    return 0;
  }

  if (str.toLowerCase().charAt(0) == query.toLowerCase().charAt(0)) {
    return this._matchLen(str.substring(1), query.substring(1), acc + 1, 1);
  } else {
    return this._matchLen(str.substring(1), query, acc + incr, incr);
  }
};
