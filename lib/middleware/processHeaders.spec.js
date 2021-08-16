'use strict';

/* eslint-env mocha */
/* eslint "jsdoc/require-jsdoc": 0 */

// --------------------------------------------------------------------------
//                      GLOBAL VAR DEFINITIONS
// --------------------------------------------------------------------------

const assert = require('assert');
const rewire = require('rewire');
const pf = rewire('./processHeaders.js');

// Map rewired, private functions to friendlier names
const matchesAppJsonPattern = pf.__get__('matchesAppJsonPattern');
const getHeaderValue = pf.__get__('getHeaderValue');

// --------------------------------------------------------------------------
//                      HELPER FUNCTIONS
// --------------------------------------------------------------------------

function getH(name) {
  if (name === 'X-Api-Token' || name === 'Accept') return 'ok';
  return null;
}

// --------------------------------------------------------------------------
//                      MOCHA TESTS
// --------------------------------------------------------------------------

describe('Test regex', function() {
  const func = matchesAppJsonPattern;
  it('should return true', function() {
    const s = 'application/json';
    assert.strictEqual(func(s), true);
  });
  it('should return true', function() {
    const s = ';application/json';
    assert.strictEqual(func(s), true);
  });
  it('should return true', function() {
    const s = 'application/json;q=foo';
    assert.strictEqual(func(s), true);
  });
  it('should return false', function() {
    const s = 'application/jsonp';
    assert.strictEqual(func(s), false);
  });
});

describe('Read HTTP header', function() {
  const func = getHeaderValue;
  it('should return a known string', function() {
    const name = 'X-Api-Token';
    const o = {header: function() { return getH(name); }};
    const result = func(name, o);
    assert.strictEqual(result, 'ok');
  });
  it('should return a known string', function() {
    const name = 'Accept';
    const o = {header: function() { return getH(name); }};
    const result = func(name, o);
    assert.strictEqual(result, 'ok');
  });
  it('should return a known string', function() {
    const name = 'Buz';
    const o = {header: function() { return getH(name); }};
    const result = func(name, o);
    assert.equal(result, null);
  });
  it('should throw', function() {
    assert.throws(func, Error, /Broken header processing/);
  });
  it('should throw', function() {
    const throwHelper = function() { return func([]); };
    assert.throws(throwHelper, Error, /Broken header processing/);
  });
});
