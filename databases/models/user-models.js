'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
  },
  avatarurl: String,
  fullName: String,
  password: String,
  email: String,
  secundaryMail: [{
    secundaryMail: String,
  }],
  createdAt: Date,
  confirmedAt: Date,
});

userSchema.index(
  {
    fullName: 'text',
    'preferences.linkedin': 'text',
    'preferences.github': 'text',
    'preferences.twitter': 'text',
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
