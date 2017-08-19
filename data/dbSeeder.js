// Module dependencies
const   mongoose = require('mongoose'),
		User = require('./models/user'),
        Ride = require('./models/ride'),
        GeoLocation = require('./models/geo-location'),	
        dbConfig = require('./configLoader').databaseConfig,
        connectionString = `mongodb://${dbConfig.host}/${dbConfig.database}`,
        connection = null;
var ridesRepoAvia = require('./repos/ridesRepository');
class DBSeeder {
    
    init() {
        mongoose.connection.db.listCollections({name: 'rides'})
            .next((err, collinfo) => {
                if (!collinfo) {
                    this.seed();
                }
                else{
                    console.log('DB has already been seeded');
                }
            });
    }
    
    seed() {

        console.log('Seeding data....');

        //RIDES
        Ride.remove({});
		var rides = 
		[
			new Ride({
                "driverId" : "10212506273121984",
                "phoneNumber" : "0526415586",
                "seets" : 9,
                "trempDateTime" : "7/6/2017 23:6:46",
                "carModel" : "קיה ",
                "sourc eAddress" : {
                    "long" : 34.7951346,
                    "lat" : 32.0452517
                },
                "destAddress" : {
                    "long" : 34.811272,
                    "lat" : 31.892773
                },
                "imageName" : "",
                "Passengers" : [],}),
            new Ride({
                "driverId" : "10212506273121984",
                "phoneNumber" : "0526415586",
                "seets" : 2,
                "trempDateTime" : "8/6/2017 15:00:41",
                "carModel" : "קיה ",
                "sourceAddress" : {
                    "long" : 34.820038,
                    "lat" : 31.962082
                },
                "destAddress" : {
                    "long" : 34.772136,
                    "lat" : 32.084301
                },
                "imageName" : "",
                "Passengers" : [],
            }),
            new Ride({
                "driverId" : "10155114613427430",
                "phoneNumber" : "0547861869",
                "seets" : 2,
                "trempDateTime" : "8/6/2017 10:23:26",
                "carModel" : "קרעה",
                "sourceAddress" : {
                    "long" : 34.7757399,
                    "lat" : 31.9775223
                },
                "destAddress" : {
                    "long" : 34.764014,
                    "lat" : 32.017203
                },
                "imageName" : "",
                "Passengers" : [],
            }),
		];

        for (var i = 0; i < rides.length; i++) {
            
			var ride = rides[i];
            ride.save((err, r) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('New Ride: [' + r._id +'] - ' + r.sourceAddress);
                }
            });
            ridesRepoAvia.getRidesByDateAvia(ride.trempDateTime);

        }
    }
}

module.exports = new DBSeeder();




