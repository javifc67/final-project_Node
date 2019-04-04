'use strict';

const UserModel = require('../../../databases/models/user-models');

async function getUserProfile(req, res, next) {
  const { claims } = req;

  try {
    const data = await UserModel.findOne({ uuid: claims.uuid }, '-_id -__v').lean(true);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(401).send(err.message);
  }
}

module.exports = getUserProfile;
