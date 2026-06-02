const app = require('./app');
const env = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const logger = require('./utils/logger');
const { registerJobs } = require('./jobs');

let server;

async function start() {
  try {
    await connectDB();
    registerJobs();
    server = app.listen(env.port, () => {
      logger.info(`JenPark API listening on port ${env.port} [${env.env}]`);
      logger.info(`Swagger docs: http://localhost:${env.port}/api/docs`);
    });
  } catch (err) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  }
}

async function shutdown(signal) {
  logger.info(`Received ${signal}. Shutting down...`);
  try {
    if (server) await new Promise((resolve) => server.close(resolve));
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    logger.error(`Shutdown error: ${err.message}`);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => logger.error(`unhandledRejection: ${reason}`));
process.on('uncaughtException', (err) => {
  logger.error(`uncaughtException: ${err.stack || err.message}`);
  process.exit(1);
});

start();
