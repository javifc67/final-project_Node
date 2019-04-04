'use strict';

const Joi = require('joi');
const UserModel = require('../../../databases/models/user-models');

async function validate(payload) {
  const schema = {
    q: Joi.string().min(3).max(128).required(),
  };
  return Joi.validate(payload, schema);
}

async function search (req, res, next) {
  const { q } = req.query;

  try {
    await validate({ q });
  } catch (e) {
    return res.status(400).send(e);
  }

  try {
    const result = await UserModel.find({ $text: { $search: q } });
    return res.status(201).send(result);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = search;
