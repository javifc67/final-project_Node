'use strict';

const UserModel = require('../../../databases/models/user-model');
const CurrentUserModel = require('../../../databases/models/currentUser-model');


async function getUserProfile(req, res, next) {
  const { uuid } = req.claims;

  const userProfile = await UserModel.findOne({ uuid });
  await CurrentUserModel.create({ uuid });
  return res.status(200).send(userProfile);
}
module.exports = { getUserProfile };
