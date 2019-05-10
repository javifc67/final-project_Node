'use strict';

const express = require('express');

const router = express.Router();

const getWall = require('../controllers/facebook/get-wall-home');
const checkJwt = require('../controllers/session/check-jwt-token');


router.get('/wall', checkJwt, getWall);

module.exports = router;
