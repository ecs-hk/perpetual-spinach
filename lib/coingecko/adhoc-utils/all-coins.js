'use strict';

/* eslint "jsdoc/require-jsdoc": 0 */
/* eslint no-process-exit: "off" */

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const process = require('process');
const coin = require('..');

// ---------------------------------------------------------------------------
//                  FUNCTIONS
// ---------------------------------------------------------------------------

function errout(err) {
  console.error(err);
  process.exit(1);
}

function toPrettyJson(data) {
  return JSON.stringify(data, null, 2);
}

// ---------------------------------------------------------------------------
//                  MAIN LOGIC
// ---------------------------------------------------------------------------

coin.getAllCoins()
    .then(data => console.log(toPrettyJson(data)))
    .catch(err => errout(err));
