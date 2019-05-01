'use strict';

const Twitter = require('twitter');
const schedule = require('node-schedule');
const PuaModel = require('../../../databases/models/pua-model');

async function postTweet(req, res, next) {
  const { claims } = req;
  const data = { ...req.body };
  let date = new Date(data.date);
  let h = new Date();
  if (date < h) {
    date = h;
  }
  date.setSeconds(date.getSeconds() + 20);
  try {
    const filter = {
      uuid: claims.uuid,
      'puas.name': 'twitter',
    };
    const keys = await PuaModel.findOne(filter, { 'puas.token': 1, 'puas.tokenSecret': 1 });


    await schedule.scheduleJob((date), () => {
      const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: keys.puas[0].token,
        access_token_secret: keys.puas[0].tokenSecret,
      });

      client.post('statuses/update', { status: data.message }, (error, tweet, response) => {
        if (error) {
          console.log(error);
        }
      });
    });
    return res.status(200);
  } catch (err) {
    console.log({ err });
    return res.status(500).send(err.message);
  }
}

module.exports = postTweet;
