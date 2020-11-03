// database model and Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema(
  {
    email: { type: String },
    password: { type: String },
    code: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', Schema);
module.exports = User;
