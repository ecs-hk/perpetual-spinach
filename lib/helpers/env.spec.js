'use strict';

/* eslint-env mocha */
/* eslint "jsdoc/require-jsdoc": 0 */

// --------------------------------------------------------------------------
//                      GLOBAL VAR DEFINITIONS
// --------------------------------------------------------------------------

const assert = require('assert');
const process = require('process');
const f = require('./env.js');

const ENV_PLACEHOLDER = {};

// --------------------------------------------------------------------------
//                      HELPER FUNCTIONS
// --------------------------------------------------------------------------

function saveEnvVariable(name) {
  ENV_PLACEHOLDER[name] = process.env[name];
}

function restoreEnvVariable(name) {
  process.env[name] = ENV_PLACEHOLDER[name];
}

function deleteEnvVariable(name) {
  if (process.env.hasOwnProperty(name)) {
    delete process.env[name];
  }
}

function setEnvVariable(name, value) {
  process.env[name] = value;
}

// --------------------------------------------------------------------------
//                      MOCHA TESTS
// --------------------------------------------------------------------------

describe('Read from environment variables', function() {
  describe('HTTP server settings', function() {
    saveEnvVariable('EXPRESS_IP');
    saveEnvVariable('EXPRESS_PORT');
    it('should return a known object', function() {
      const ip = '10.0.0.80';
      const port = '8443';
      setEnvVariable('EXPRESS_IP', ip);
      setEnvVariable('EXPRESS_PORT', port);
      const result = f.getHttpServerConfig();
      restoreEnvVariable('EXPRESS_IP');
      restoreEnvVariable('EXPRESS_PORT');
      assert.equal(result.hasOwnProperty('ip'), true);
      assert.equal(result.hasOwnProperty('port'), true);
      assert.strictEqual(result.ip, ip);
      assert.strictEqual(result.port, port);
    });
    it('should return a known object', function() {
      deleteEnvVariable('EXPRESS_IP');
      deleteEnvVariable('EXPRESS_PORT');
      const result = f.getHttpServerConfig();
      restoreEnvVariable('EXPRESS_IP');
      restoreEnvVariable('EXPRESS_PORT');
      assert.equal(result.hasOwnProperty('ip'), true);
      assert.equal(result.hasOwnProperty('port'), true);
      assert.strictEqual(result.ip, '0.0.0.0');
      assert.strictEqual(result.port, '8080');
    });
  });
  const throwers = [
    { name: 'MAGIC_TOKEN', func: f.getToken },
  ];
  throwers.forEach(x => {
    describe(x.name, function() {
      saveEnvVariable(x.name);
      it('should return a known string', function() {
        const val = 'fuz';
        setEnvVariable(x.name, val);
        const result = x.func();
        restoreEnvVariable(x.name);
        assert.strictEqual(result, val);
      });
      it('should throw an exception', function() {
        deleteEnvVariable(x.name);
        assert.throws(x.func, Error);
        restoreEnvVariable(x.name);
      });
    });
  });
});
