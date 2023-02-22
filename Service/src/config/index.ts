"use strict";

// Libraries
import * as dotenv from "dotenv";

// Enable configuration of dotenv
dotenv.config();

/**
 * Configuration of environment for server
 */
const config = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.PORT,
  routePFX: process.env.ROUTE_PFX,
  sslKey: process.env.SSL_KEY,
};

export default config;
