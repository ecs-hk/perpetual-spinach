'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const {setContentType} = require('./lib/middleware/processHeaders.js');
const {getHttpServerConfig} = require('./lib/helpers/env.js');
const routes = require('./lib/routes');

// ---------------------------------------------------------------------------
//                  HTTP SERVER SETUP
// ---------------------------------------------------------------------------

const httpListener = getHttpServerConfig();
const app = express();

// Enable correct behavior behind a reverse proxy (e.g. Apache HTTP server,
// OpenShift route with SSL termination, etc.) and allow cookie.secure to
// be set. See:
//   https://expressjs.com/en/guide/behind-proxies.html
//
// Note that the reverse proxy must set the request header:
//   X-Forwarded-Proto "https"
app.set('trust proxy', ['loopback', 'uniquelocal']);

// Enable various security mechanisms with helmet
app.use(helmet());

// Enabled logging with morgan
app.use(morgan('combined'));

// Set up session and body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({strict: false}));

// ---------------------------------------------------------------------------
//                  MIDDLEWARE SETUP
// ---------------------------------------------------------------------------

const mid = [setContentType];

// ---------------------------------------------------------------------------
//                  EXPRESS ROUTES
// ---------------------------------------------------------------------------

app.get('/', mid, routes.index);

// Return HTTP 404 if no matching route
app.use((req, res, next) => {
  return res.status(404).json({message: 'Not found'});
});

// Handle all uncaught errors
app.use((err, req, res, next) => {
  console.error('Uncaught exception bubbled up to app handler:');
  console.error(err.message);
  console.error(err.stack);
  return res.status(500).json({message: 'Internal error'});
});

// ---------------------------------------------------------------------------
//                  START HTTP SERVER
// ---------------------------------------------------------------------------

const server = http.createServer(app);

server.listen(httpListener.port, httpListener.ip, () => {
  console.log('HTTP server ready and listening');
});
