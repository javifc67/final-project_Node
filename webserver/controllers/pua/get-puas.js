'use strict';

const PuaModel = require('../../../databases/models/pua-model');


async function getPuas(req, res) {
  const { uuid } = req.claims;


  try {
    const puas = await PuaModel.findOne({ uuid }, { _id: 0, __v: 0 }).lean();

    return res.send(puas);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getPuas;
