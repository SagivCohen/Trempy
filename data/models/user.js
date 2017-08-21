const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId 	: { type : String, required: true, trim: true },
},{ versionKey: false });

module.exports = mongoose.model('User', UserSchema);

