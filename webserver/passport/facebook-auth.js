'use strict';

const passport = require('passport');
const { Strategy } = require('passport-facebook');
const PuaModel = require('../../databases/models/pua-model');

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser(async(obj, cb) => {
  cb(null, obj);
});

passport.use(new Strategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback',
  passReqToCallback: true,
  state: true,
}, async(req, accessToken, refreshToken, profile, cb) => {
  const op = {
    $set: {
      'puas.$.token': accessToken,
      'puas.$.refreshToken': refreshToken,
      'puas.$.fbid': profile.id,
    },
  };
  const filter = {
    facebookName: profile.displayName,
    'puas.name': 'facebook',
  };

  await PuaModel.findOneAndUpdate(filter, op);

  /*  PuaModel.findOrCreate({ facebookId: profile.id  }, (err, user) => cb(err, user)); */
  return cb(null, profile);
}));
