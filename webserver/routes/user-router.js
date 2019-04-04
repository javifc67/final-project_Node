'use strict';

const express = require('express');
const multer = require('multer');
const getUserProfile = require('../controllers/user/get-user-profile');
const checkJwtToken = require('../controllers/session/check-jwt-token');
const updateUserProfile = require('../controllers/user/update-user-profile');
const avatarUserProfile = require('../controllers/user/upload-avatar');
const searchUserProfile = require('../controllers/user/search-user');
const getFriendReq = require('../controllers/user/friends-request');
const friendsReqUserProfile = require('../controllers/user/get-friend-requests');
const acceptFriend = require('../controllers/user/accept-friend');
const getUserWall = require('../controllers/user/user-wall');

const upload = multer();
const router = express.Router();

router.get('/user', checkJwtToken, getUserProfile);
router.get('/user/search', checkJwtToken, searchUserProfile);
router.get('/user/friendrequest', checkJwtToken, friendsReqUserProfile);
router.get('/user', checkJwtToken, getUserWall);
router.put('/user', checkJwtToken, updateUserProfile);
router.post('/user/avatar', checkJwtToken, upload.single('avatar'), avatarUserProfile);
router.post('/user/friendrequest', checkJwtToken, getFriendReq);
router.post('/user/friendrequest/accept', checkJwtToken, acceptFriend);

module.exports = router;
