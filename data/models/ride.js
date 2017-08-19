const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const GeoLocation = require('./geo-location');	

// const GeoLocationSchema = new Schema({
// 	long: 		{ type : Number },
// 	lat: 			{ type : Number }
// });

const RideSchema = new Schema({
	driverId	  		 : { type : String, required: true },
	phoneNumber	  		 : { type : String, required: true },
	seets		  		 : { type : Number, required: true },
    trempDateTime		 : { type : String, required: true },
	carModel 		       : { type : String, required: true },
	sourceAddress		 : GeoLocation.schema,
	destAddress		       : GeoLocation.schema,
	imageName		       : { type : String },
	Passengers		       : [{ type : String }]
});

module.exports = mongoose.model('Ride', RideSchema);