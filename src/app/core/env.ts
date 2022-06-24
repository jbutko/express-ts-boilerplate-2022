import fs from 'fs';
import dotenv from 'dotenv';
import { DotenvParseOutput } from 'dotenv';
import checkEnv from '@47ng/check-env';
import debug from 'debug';

const logger = debug('app:src/app/core/env.ts');

/**
 * Load environment variables from .env/.env.local files
 */
export const loadEnvSettings = (): DotenvParseOutput | any => {
  // if file `.env.local` => override config from `.env` base configuration file
  try {
    const CONSTANTS = dotenv.config({ path: '.env' });
    let parsedConstants = CONSTANTS.parsed as DotenvParseOutput;

    const localEnvConfig = dotenv.parse(fs.readFileSync('.env.local'));
    const envOverrides = {};
    for (const envSetting in localEnvConfig) {
      const value = localEnvConfig[envSetting];
      process.env[envSetting] = value;
      Object.assign(envOverrides, { [envSetting]: value });
    }
    parsedConstants = { ...parsedConstants, ...envOverrides };
    return parsedConstants;
  } catch (err) {
    if (err instanceof Error) {
      logger('loadEnvSettings:: err:', err);
      throw new Error(err.message);
    }
  }
};

export const checkRequiredEnvSettings = (): void => {
  const requiredEnvSettings = ['PORT', 'DB_URL'];
  checkEnv({
    required: requiredEnvSettings,
  });
};

export const CONSTANTS: DotenvParseOutput | any = loadEnvSettings();
