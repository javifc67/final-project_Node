'use strict';

const express = require('express');

const router = express.Router();
const postTweet = require('../controllers/twitter/tweet');
const getTweets = require('../controllers/twitter/get-tweets-home');
const retweet = require('../controllers/twitter/retweet.js');
const addFav = require('../controllers/twitter/like');
const checkJwt = require('../controllers/session/check-jwt-token');

router.post('/retweet', checkJwt, retweet);
router.post('/addFav', checkJwt, addFav);
router.post('/tweet', checkJwt, postTweet);
router.get('/tweets', checkJwt, getTweets);

module.exports = router;
