'use strict';

const UserModel = require('../../../databases/models/user-model');
const puaModel = require('../../../databases/models/pua-model');


async function getUserProfile(req, res, next) {
  const { uuid } = req.claims;

  const userProfile = await UserModel.findOne({ uuid }, { __v: 0 });
  const twitterName = await puaModel.findOne({ uuid }, { twitterName: 1 });


  userProfile.twitterName = twitterName.twitterName;

  const userData = {
    uuid: userProfile.uuid,
    fullName: userProfile.fullName,
    email: userProfile.email,
    twitterName: twitterName.twitterName,
  };

 
  return res.status(200).send(userData);
}
module.exports = { getUserProfile };
