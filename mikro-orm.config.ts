import { Options } from '@mikro-orm/core';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `./${process.env.NODE_ENV}.env`,
}); // sets up dotenv to pull from our environment file

const config = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  type: 'mysql',
  port: +(process.env.DP_PORT as string) || 3308,
  debug: true,
  allowGlobalContext: true, // bing chat credit for telling me to add this line to access db in service-only
} as Options;

export default config;
