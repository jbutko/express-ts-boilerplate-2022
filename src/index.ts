import { checkRequiredEnvSettings } from './app/core/env'; // loads .env/.env.local
checkRequiredEnvSettings();

import http from 'http';
import debug from 'debug';
import { App } from './app/app';
import { connectDB } from './app/core/database';

const logger = debug('app:src/index.ts');

connectDB();

const app: App = new App();
const port = normalizePort(process.env.PORT || 4000);

const server = http.createServer(app.app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Normalize port
function normalizePort(val: number | string): number {
  const portNumber: number = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(portNumber)) throw new Error('Wrong PORT number');
  return portNumber;
}

// Server error handling
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      logger(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// On server listening handler
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr && addr.port}`;
  logger(`App started and listening on ${bind}`);
}

process.on('SIGTERM', async () => {
  logger('Received SIGTERM, app closing...');
  server.close(() => logger('server close: SIGTERM'));
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger('Received SIGINT, app closing...');
  server.close(() => logger('server close: SIGINT'));
  process.exit(0);
});

process.on('SIGUSR2', async () => {
  logger('Received SIGUSR2, app closing...');
  server.close(() => logger('server close: SIGUSR2'));
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  logger(`Unhandled promise rejection thrown: `);
  logger(reason);
  logger('Received SIGINT, app closing...');
  server.close(() => logger('server close: unhandledRejection'));
  process.exit(1);
});
