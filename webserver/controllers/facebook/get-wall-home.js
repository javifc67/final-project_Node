'use strict';

const fetch = require('isomorphic-fetch');
const PuaModel = require('../../../databases/models/pua-model');

async function getWall(req, res) {
  const { claims } = req;
  try {
    const filter = {
      uuid: claims.uuid,
      'puas.name': 'facebook',
    };

    const keys = await PuaModel.findOne(filter, { 'puas.token': 1, 'puas.fbid': 1 });

    const data = await fetch(`https://graph.facebook.com/${keys.puas[1].fbid}/feed?access_token=${keys.puas[1].token}`);
    const posts = await data.json();

    const postsFormated = posts.data.filter(el => el.message != null);

    res.status(200).send(postsFormated);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

module.exports = getWall;
