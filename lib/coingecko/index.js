'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const axios = require('axios');
const appDebug = require('debug')('ps:cg');

const BASE_URI = 'https://api.coingecko.com/api/v3'

// ---------------------------------------------------------------------------
//                  HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Build URI for request.
 *
 * @param {string} path - API path.
 * @returns {string} URI.
 */
function buildUri(path) {
  if (!path || typeof path !== 'string') {
    throw new Error('Malformed path');
  }
  return `${BASE_URI}${path}`;
}

/**
 * Get data from CoinGecko.
 *
 * @param {string} path - Request path.
 * @returns {Promise<object[]>} Response.
 */
async function getData(path) {
  try {
    const conf = {method:'get', url:buildUri(path)};
    appDebug(`GET ${conf.url}`);
    const res = await axios(conf);
    return res.data;
  } catch (err) {
    console.error('Thrown during GET');
    throw err;
  }
}

// ---------------------------------------------------------------------------
//                  FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Confirm CoinGecko API service is available.
 *
 * @returns {Promise<boolean>} Status.
 */
async function isServiceUp() {
  try {
    const path = '/ping';
    const res = await getData(path);
    appDebug(res);
    if (!res.hasOwnProperty('gecko_says')) return false;
    if (!res['gecko_says'].includes('Moon')) return false;
    return true;
  } catch (err) {
    console.error('Thrown getting API service status');
    throw err;
  }
}

/**
 * Get all coins.
 *
 * @returns {Promise<object[]>} List of all coins, IDs, names, etc.
 */
async function getAllCoins() {
  try {
    const path = '/coins/list';
    const res = await getData(path);
    appDebug(res);
    return res;
  } catch (err) {
    console.error('Thrown getting list of all coins');
    throw err;
  }
}

/**
 * Get individual coin data.
 *
 * @param {string} id - Coin ID.
 * @returns {Promise<object>} Information about coin.
 */
async function getCoin(id) {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error(`Invalid coin ID (${id})`);
    }
    const path = `/coins/${id}`;
    const res = await getData(path);
    appDebug(res);
    return res;
  } catch (err) {
    console.error(`Throwing getting coin data (${id})`);
    throw err;
  }
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.getAllCoins = getAllCoins;
exports.getCoin = getCoin;
exports.isServiceUp = isServiceUp;
