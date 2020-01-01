#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app';
import debugLib from 'debug';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';

/**
 * https://github.com/motdotla/dotenv/issues/272#issuecomment-445319813
 * https://github.com/facebook/create-react-app/blob/4562ab6fd80c3e18858b3a9a3828810944c35e36/packages/react-scripts/config/env.js#L25-L49
 */
const envDot = dotenv.config({ path: path.resolve(__dirname, `../../.env`) });

const debug = debugLib('your-project-name:server');

/**
 * Normalize a port into a number, string, or false.
 */

let normalizePort = (val) => {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

let onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

let onListening = () => {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/**
 * Check .env file exists or not.
 */

if (envDot.error) {
  throw envDot.error
}

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3000');
let hostname = normalizePort(process.env.HOSTNAME || 'localhost');
app.set('port', port);
app.set('hostname', hostname);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
server.on('error', onError);
server.on('listening', onListening);