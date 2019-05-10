'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const puaSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
  },
  twitterName: String,
  facebookName: String,
  puas: {
    type: Array,
    default: [{
      name: 'twitter',
      url: 'https://twitter.com',
      token: '',
      tokenSecret: '',
      visitCount: 0,
      userInfo: [ObjectId],
    },
    {
      name: 'facebook',
      url: 'https://www.facebook.com',
      fbid: '',
      token: '',
      refreshToken: '',
      visitCount: 0,
      userInfo: [ObjectId],
    }],
  },

});

const Puas = mongoose.model('Puas', puaSchema);

module.exports = Puas;
