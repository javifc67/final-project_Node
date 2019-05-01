'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const twUserDataSchema = new Schema({

  id: Number,
  id_str: String,
  name: String,
  screen_name: String,
  location: String,
  description: String,
  followers_count: Number,
  friends_count: Number,
  created_at: String,
  favourites_count: Number,
  verified: Boolean,
  statuses_count: Number,
  lang: String,
  profile_image_url_https: String,

});

const twUserData = mongoose.model('twUserData', twUserDataSchema);

module.exports = twUserData;
