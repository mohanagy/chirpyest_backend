#!/usr/bin/env node

/**
 * Module dependencies.
 */

import debug from 'debug';
import http from 'http';
import app from '../app';
import config from '../config';
import { dbConfig } from '../database';
import logger from '../helpers/logger';
import { ErrnoException } from '../interfaces';

debug('chirpyest:server');

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val: string): number | string | boolean => {
  // eslint-disable-next-line radix
  const serverPort = parseInt(val, 10);
  if (Number.isNaN(serverPort)) {
    // named pipe
    return val;
  }
  if (serverPort >= 0) {
    // port number
    return serverPort;
  }
  return false;
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(config.server.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error: ErrnoException): void => {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      throw new Error();
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      throw new Error();
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = (): void => {
  const addr = server.address() || {
    port,
  };
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
  logger.info(`Listening on ${bind}`);
};

dbConfig
  .sync({ force: process.env.NODE_ENV === 'test' ? true : undefined })
  .then(() => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
  .catch((err: ErrnoException) => {
    debug(`error can't access the database : ${err}`);
    logger.error(`can't access the database :${err}`);
  });
