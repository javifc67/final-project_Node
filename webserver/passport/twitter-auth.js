'use strict';

const passport = require('passport');
const { Strategy } = require('passport-twitter');
const PuaModel = require('../../databases/models/pua-model');
const TwUserDataModel = require('../../databases/models/twitter.userData-model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
  const user = await PuaModel.find({ id });
  done(null, user);
});


passport.use(new Strategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://127.0.0.1:8000/test/twitter',
  passReqToCallback: true,
  state: true,

}, (async(req, token, tokenSecret, user, cb) => {
  const {
    id,
    id_str,
    name,
    screen_name,
    location,
    description,
    followers_count,
    friends_count,
    created_at,
    favourites_count,
    verified,
    statuses_count,
    lang,
    profile_image_url_https,
  } = user._json;

  const userData = {
    id,
    id_str,
    name,
    screen_name,
    location,
    description,
    followers_count,
    friends_count,
    created_at,
    favourites_count,
    verified,
    statuses_count,
    lang,
    profile_image_url_https,


  };

  const userDataCreated = await TwUserDataModel.create(userData);

  const userId = userDataCreated._id;

  const op = {
    $set: {
      'puas.$.token': token,
      'puas.$.tokenSecret': tokenSecret,
      'puas.$.userInfo': userId,
    },
  };
  const filter = {
    twitterName: screen_name,
    'puas.name': 'twitter',
  };

  await PuaModel.findOneAndUpdate(filter, op);
  return cb(null, user);
})));
