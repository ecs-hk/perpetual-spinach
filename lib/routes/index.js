'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const appDebug = require('debug')('pspin:routes');

// ---------------------------------------------------------------------------
//                  EXPORTED FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Send generic response.
 *
 * @param {object} req - Express (HTTP) request object.
 * @param {object} res - Express (HTTP) response object.
 * @returns {*} JSON/string response.
 */
function index(req, res) {
  if (res.locals.contentType === 'json') {
    appDebug('Sending JSON content');
    return res.json({message: 'Hello'});
  }
  return res.send('<!doctype html><meta charset=utf-8><title>Hello</title>');
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.index = index;
