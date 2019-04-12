'use strict';

const express = require('express');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const getPuas = require('../controllers/pua/get-puas');
const updatePuas = require('../controllers/pua/update-puas');

const router = express.Router();

router.get('/pua', checkJwtToken, getPuas);
router.put('/pua', checkJwtToken, updatePuas);


module.exports = router;
