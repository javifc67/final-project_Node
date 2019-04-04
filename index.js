'use strict';

require('dotenv').config();
const webServer = require('./webserver');
const httpServerConfig = require('./config/http-server-config');
const mongoPool = require('./databases/mongo-pool');
// const mongoPool = require('./app/domain/builders/mongo-pool-builder');

/**
 * Initialize dependencies
 * */
(async function initApp() {
  try {
    await mongoPool.connect();
    await webServer.listen(httpServerConfig.port);
    console.log(`server running at: ${httpServerConfig.port}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}());
