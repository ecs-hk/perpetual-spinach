'use strict';

// ---------------------------------------------------------------------------
//                  FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Tests string for specific regex.
 *
 * @param {string} data - Arbitary string.
 * @returns {boolean} True if string matches specific regex.
 */
function matchesAppJsonPattern(data) {
  const reg = /\bapplication\/json\b/i;
  if (reg.test(data)) return true;
  return false;
}

/**
 * Get HTTP header value from Express request.
 *
 * @param {string} name - Request header name.
 * @param {object} req - HTTP request object.
 * @returns {string} Token.
 */
function getHeaderValue(name, req) {
  if (!name || typeof name !== 'string') {
    throw new Error('Broken header processing');
  }
  if ({}.toString.call(req.header) === '[object Function]') {
    return req.header(name);
  }
  return null;
}

/**
 * Set accepted response content type in locals.
 *
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 * @param {Function} next - Next function to call in Express middleware.
 * @returns {Function} Next function.
 */
function setContentType(req, res, next) {
  const name = 'Accept';
  if (matchesAppJsonPattern(getHeaderValue(name, req))) {
    res.locals.contentType = 'json';
  }
  return next();
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.setContentType = setContentType;
