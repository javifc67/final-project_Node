'use strict';

const express = require('express');
const checkJwtToken = require('../controllers/session/check-jwt-token');
const post = require('../controllers/posts/create-post');

const router = express.Router();


router.post('/post', checkJwtToken, post);


module.exports = router;
