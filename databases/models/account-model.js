'use strict';

const mongoose = require('mongoose');
const beutifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const accountSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
  },
  createdAt: Date,
  confirmedAt: Date,
  verificationCode: String,
  password: String,
  email: {
    type: String,
    unique: true,
  },
});

accountSchema.plugin(beutifyUnique);

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
