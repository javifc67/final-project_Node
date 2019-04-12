'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const puaSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
  },
  puas: {
    type: Array,
    default: [{
      name: 'instagram',
      url: 'https://www.instagram.com/?hl=es',
      mailUser: '',
      password: '',
      visitCount: 0,
      createdAt: null,
      confirmedAt: null,
    },
    {
      name: 'linkedin',
      url: 'https://www.linkedin.com',
      mailUser: '',
      password: '',
      visitCount: 0,
      createdAt: null,
      confirmedAt: null,
    }],
  },

});

const Puas = mongoose.model('Puas', puaSchema);

module.exports = Puas;
