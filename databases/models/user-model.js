'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
  },
  fullName: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
