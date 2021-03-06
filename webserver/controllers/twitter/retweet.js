'use strict';

const Twitter = require('twitter');
const PuaModel = require('../../../databases/models/pua-model');

async function retweet(req, res) {
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
    client.post(`statuses/retweet/${tweetIds}`, (error, tweet, response) => {
      if (!error) {
        const {
          created_at,
          id,
          id_str,
          text,
          user,
          retweet_count,
          favorite_count,
        } = tweet;
        const tweetFormated = {
          created_at,
          id,
          id_str,
          text,
          user,
          retweet_count,
          favorite_count,
        };
        res.status(200).send(tweetFormated);
      } else {
        console.error(error);
      }
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

module.exports = retweet;
