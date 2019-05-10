'use strict';

const dot = require('dot-object');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const UserModel = require('../../../databases/models/user-model');
const AccountModel = require('../../../databases/models/account-model');
const PuaModel = require('../../../databases/models/pua-model');

async function validate(payload) {
  const schema = {
    twitterName: Joi.string().min(3).max(128),
    fullName: Joi.string().min(3).max(128),
    email: Joi.string().min(3).max(128),
    password: Joi.string().min(3).max(128),
  };

  return Joi.validate(payload, schema);
}

async function updateUserProfile(req, res, next) {
  let userDataProfile = { ...req.body };
  console.log(userDataProfile);
  if (userDataProfile.password === '') {
    userDataProfile = {
      fullName: userDataProfile.fullName,
      twitterName: userDataProfile.twitterName,
      email: userDataProfile.email,
    };
  }
  console.log(userDataProfile);

  const { claims } = req;
  /**
   * 1. validator datos
   */
  try {
    await validate(userDataProfile);
  } catch (e) {
    return res.status(400).send(e);
  }

  try {
    const userDataProfileMongoose = dot.dot(userDataProfile);

    let newUser = {
      email: userDataProfileMongoose.email,
      fullname: userDataProfileMongoose.fullName,
    };

    if (userDataProfileMongoose.password !== undefined) {
      await UserModel.updateOne({ uuid: claims.uuid }, userDataProfileMongoose);
      const securepass = await bcrypt.hash(userDataProfileMongoose.password, 10);
      newUser = {
        password: securepass,
        email: userDataProfileMongoose.email,
        fullname: userDataProfileMongoose.fullName,
      };
    }
    await AccountModel.updateOne({ uuid: claims.uuid }, newUser);
    await PuaModel.updateOne({ uuid: claims.uuid }, { twitterName: userDataProfileMongoose.twitterName });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

module.exports = updateUserProfile;
