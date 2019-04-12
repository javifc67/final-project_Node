'use strict';

const express = require('express');
const createAccount = require('../controllers/account/create-account');
const activateAccount = require('../controllers/account/activate-account');
const login = require('../controllers/account/login');
// const first-login = require('../controllers/account/first-login');

const accountRouter = express.Router();

accountRouter.post('/account', createAccount);
accountRouter.get('/account/activate', activateAccount);

// accountRouter.post('/account/login', login-first);
accountRouter.post('/account/login', login);

module.exports = accountRouter;
