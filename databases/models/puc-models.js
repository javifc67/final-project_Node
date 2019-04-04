'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const puaSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
  },
  puas: [{
    name: String,
    url: String,
    mailUser: String,
    password: String,
    visitCount: Number,
    createdAt: Date,
    confirmedAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  }],

});

const Puas = mongoose.model('Puas', puaSchema);

module.exports = Puas;
