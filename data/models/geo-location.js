const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const GeoLocationSchema = new Schema({
	long: 		{ type : Number },
	lat: 			{ type : Number }
},{ _id : false, versionKey: false });

module.exports = mongoose.model('GeoLocation', GeoLocationSchema);