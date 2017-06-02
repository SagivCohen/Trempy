const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName 	: { type : String, required: true, trim: true },
  lastName    : { type : String, required: true, trim: true },
  age			    : { type : Number, required: true, trim: true },
  facebookID	: { type : String },
  googleID		: { type : String },
});

module.exports = mongoose.model('User', UserSchema);

