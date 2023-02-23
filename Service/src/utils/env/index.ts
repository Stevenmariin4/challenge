'use strict';

// libraries
import * as dotenv from 'dotenv';
import * as envalid from 'envalid';

// Enable configuration of dotenv
dotenv.config();

/**
 * envalid behavior for env vars
 * @param  process.env vars env
 */
const env = envalid.cleanEnv(process.env, {
  PORT: envalid.port(),

  DB_HOST: envalid.str(),
  DB_PORT: envalid.port(),
  DB_NAME: envalid.str(),
  DB_IS_ClOUD: envalid.bool(),
  URLMELI: envalid.str(),
});
export default env;
