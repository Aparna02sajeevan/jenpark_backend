const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

mongoose.set('strictQuery', true);

async function connectDB() {
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      autoIndex: env.env !== 'production',
      serverSelectionTimeoutMS: 10000,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

module.exports = { connectDB, disconnectDB };
