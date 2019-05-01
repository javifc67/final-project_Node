'use strict';

const dot = require('dot-object');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const UserModel = require('../../../databases/models/user-model');
const AccountModel = require('../../../databases/models/account-model');

async function validate(payload) {
  const schema = {
    fullName: Joi.string().min(3).max(128).required(),
    email: Joi.string().min(3).max(128).required(),
    password: Joi.string().min(3).max(128).required(),
  };

  return Joi.validate(payload, schema);
}

async function updateUserProfile(req, res, next) {
  const userDataProfile = { ...req.body };
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
    await UserModel.updateOne({ uuid: claims.uuid }, userDataProfileMongoose);
    const securepass = await bcrypt.hash(userDataProfileMongoose.password, 10);
    const newUser = {
      password: securepass,
      email: userDataProfileMongoose.email,
    };
    await AccountModel.updateOne({ uuid: claims.uuid }, newUser);
    return res.status(204).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

module.exports = updateUserProfile;
