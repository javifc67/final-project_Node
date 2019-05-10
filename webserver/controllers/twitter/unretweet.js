'use strict';

const Twitter = require('twitter');
const PuaModel = require('../../../databases/models/pua-model');

async function unretweet(req, res) {
  const { claims } = req;
  const { tweetId } = { ...req.body };
  const tweetIds = tweetId.toString();

  try {
    const filter = {
      uuid: claims.uuid,
      'puas.name': 'twitter',
    };
    const keys = await PuaModel.findOne(filter, { 'puas.token': 1, 'puas.tokenSecret': 1 });

    const client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: keys.puas[0].token,
      access_token_secret: keys.puas[0].tokenSecret,
    });
    client.post(`statuses/unretweet/${tweetIds}`, (error, tweet, response) => {
      if (!error) {
        console.log(tweet);
        res.status(200).send(tweet);
      } else {
        console.error(error);
      }
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

module.exports = unretweet;
