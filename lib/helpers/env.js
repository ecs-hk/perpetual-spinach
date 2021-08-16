'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const process = require('process');

// ---------------------------------------------------------------------------
//                  HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Check whether variable is set in the environment.
 *
 * @param {string} name - Name of environment variable.
 * @returns {boolean} True if variable is set and has a truthy value.
 */
function isSetInEnv(name) {
  if (!name || typeof name !== 'string') return false;
  if (!process.env.hasOwnProperty(name)) return false;
  if (!process.env[name]) return false;
  return true;
}

/**
 * Return the value of an environment variable.
 *
 * @param {string} name - Name of environment variable.
 * @returns {string} Environment variable value.
 */
function getEnvValue(name) {
  if (isSetInEnv(name)) return process.env[name];
  throw new Error(`Set ${name} in your environment`);
}

// ---------------------------------------------------------------------------
//                  FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Read HTTP listener IP and port from env, or use default values.
 *
 * @returns {object} HTTP server listener settings.
 * */
function getHttpServerConfig() {
  const vars = [
    {name: 'EXPRESS_IP', prop: 'ip'},
    {name: 'EXPRESS_PORT', prop: 'port'},
  ];
  const o = {ip: '0.0.0.0', port: '8080'};
  vars.forEach(x => {
    if (isSetInEnv(x.name)) o[x.prop] = getEnvValue(x.name);
  });
  return o;
}

/**
 * Read a comma-separated list of CoinGecko coin IDs.
 *
 * @returns {string} Coins.
 * */
function getConfiguredCoins() {
  const name = 'PS_COINS';
  return getEnvValue(name);
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.getHttpServerConfig = getHttpServerConfig;
exports.getConfiguredCoins = getConfiguredCoins;
