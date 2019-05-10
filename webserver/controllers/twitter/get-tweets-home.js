'use strict';

const Twitter = require('twitter');
const PuaModel = require('../../../databases/models/pua-model');
const TwUserDataModel = require('../../../databases/models/twitter.userData-model');

async function getTweets(req, res) {
  const { claims } = req;
  try {
    const filter = {
      uuid: claims.uuid,
      'puas.name': 'twitter',
    };

    const keys = await PuaModel.findOne(filter, { 'puas.token': 1, 'puas.tokenSecret': 1, 'puas.userInfo': 1 });

    const userData = await TwUserDataModel.find({ _id: keys.puas[0].userInfo }, { _id: 0, __v: 0 }).lean();

    const client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: keys.puas[0].token,
      access_token_secret: keys.puas[0].tokenSecret,
    });
    client.get('statuses/home_timeline', (error, tweet, response) => {
      if (!error) {
        const tweets = [];
        tweet.forEach((element) => {
          const {
            created_at,
            id,
            id_str,
            text,
            user,
            retweet_count,
            favorite_count,
          } = element;
          const tweetFormated = {
            created_at,
            id,
            id_str,
            text,
            user,
            retweet_count,
            favorite_count,
          };
          tweets.unshift(tweetFormated);
        });
        const responseData = {
          userData: userData[0],
          tweets: tweets.reverse(),
        };

        res.status(200).send(responseData);
      } else {
        console.log(error);
      }
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

module.exports = getTweets;
