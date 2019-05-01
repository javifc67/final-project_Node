'use strict';

const mongoose = require('mongoose');
const beutifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const currentUserSchema = new Schema({
  uuid: String,
});

currentUserSchema.plugin(beutifyUnique);

const CurrentUser = mongoose.model('CurrentUser', currentUserSchema);

module.exports = CurrentUser;
