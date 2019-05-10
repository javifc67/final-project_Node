'use strict';

const accountRouter = require('./account-router');
const userRouter = require('./user-router');
const puaRouter = require('./pua-router');
const twRouter = require('./twitter-router');
const fbRouter = require('./facebook-router');

module.exports = {
  accountRouter,
  userRouter,
  puaRouter,
  twRouter,
  fbRouter,
};
