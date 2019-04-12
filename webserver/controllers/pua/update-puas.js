'use strict';

const Joi = require('joi');

const PuaModel = require('../../../databases/models/pua-model');

async function validate(payload) {
  const schema = {
    name: Joi.string(),
    mailUser: Joi.string().min(3).max(128).required(),
    password: Joi.string().min(3).max(128).required(),
  };

  return Joi.validate(payload, schema);
}

async function updatePua(req, res) {
  const puaData = { ...req.body };
  const { claims } = req;

  try {
    await validate(puaData);
  } catch (e) {
    return res.status(400).send(e);
  }

  try {
    const op = {
      $set: {
        'puas.$.mailUser': puaData.mailUser,
        'puas.$.password': puaData.password,
      },
    };

    const filter = {
      uuid: claims.uuid,
      'puas.name': puaData.name,
    };
    /* Person.update({'items.id': 2}, {'$set': {
    'items.$.name': 'updated item2',
    'items.$.value': 'two updated'
}} */
    console.log(filter);
    console.log(puaData);
    console.log(op);

    const data = await PuaModel.update(filter, op);

    console.log('mongoose data', data);

    return res.status(204).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

module.exports = updatePua;
