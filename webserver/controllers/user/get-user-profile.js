'use strict';

const UserModel = require('../../../databases/models/user-model');

async function getUserProfile(req, res, next) {
  const { uuid } = req.claims;

  const userProfile = await UserModel.findOne({ uuid });

  return res.status(200).send(userProfile);
}

module.exports = getUserProfile;
