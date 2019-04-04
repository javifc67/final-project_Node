'use strict';

const Joi = require('joi');
const UserModel = require('../../../databases/models/user-models');

async function validate(payload) {
  const schema = {
    friend: Joi.string().guid({
      version: ['uuidv4'],
    }),
  };

  return Joi.validate(payload, schema);
}

async function friendReq(req, res, next) {
  const { claims } = req;
  const me = claims.uuid;

  const friend = { ...req.body };

  try {
    await validate(friend);
  } catch (e) {
    return res.status(400).send(e);
  }

  if (me === friend.friend) {
    return res.status(409).send();
  }

  const filter = {
    uuid: friend.friend,
    friends: {
      $not: {
        $elemMatch: {
          me,
        },
      },
    },
  };
  console.log(friend);

  const friendData = {
    $addToSet: {
      friends: {
        createdAt: Date.now(),
        confirmedAt: null,
        rejectedAt: null,
        uuid: me,
      },
    },
  };
  try {
    const fSend = await UserModel.updateOne(filter, friendData);
    return res.status(204).send(fSend);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = friendReq;
