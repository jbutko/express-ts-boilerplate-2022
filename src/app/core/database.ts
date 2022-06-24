import debug from 'debug';
import mongoose from 'mongoose';
import { connect } from 'mongoose';

const logger = debug('app:src/app/core/database/database.ts');

const DB_URL = process.env.DB_URL;

export const ObjectId = mongoose.Types.ObjectId;

export const connectDB = async () => {
  if (!DB_URL) throw new Error('Mongoose DB URL required');
  try {
    await connect(DB_URL);
  } catch (err) {
    if (err instanceof Error) logger('error', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Connection events

// -> successfully connected
mongoose.connection.on('connected', () => logger(`Mongoose default connection open to ${DB_URL}`));

// -> connection throws an error
mongoose.connection.on('error', (err) => logger('Mongoose default connection error: ', err));

// -> connection is disconnected
mongoose.connection.on('disconnected', () => logger('Mongoose default connection disconnected'));
