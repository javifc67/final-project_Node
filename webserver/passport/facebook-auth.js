'use strict';

const passport = require('passport');
const { Strategy } = require('passport-facebook');
const PuaModel = require('../../databases/models/pua-model');
const CurrentUserModel = require('../../databases/models/currentUser-model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
  const user = await PuaModel.find({ id });
  done(null, user);
});

passport.use(new Strategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:8000/auth/facebook/callback',
  passReqToCallback: true,
  state: true,
},
(accessToken, refreshToken, profile, cb) => {
  console.log(profile, accessToken, refreshToken);
 /*  PuaModel.findOrCreate({ facebookId: profile.id  }, (err, user) => cb(err, user)); */
}));
