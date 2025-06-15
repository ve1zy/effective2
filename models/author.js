const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: Date,
  date_of_death: Date,
});

AuthorSchema.virtual('name').get(function () {
  return `${this.family_name}, ${this.first_name}`;
});

AuthorSchema.virtual('url').get(function () {
  return `/author/${this._id}`;
});

module.exports = mongoose.model('Author', AuthorSchema);
