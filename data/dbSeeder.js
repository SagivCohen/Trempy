// Module dependencies
const   mongoose = require('mongoose'),
		User = require('./models/user'),
        Ride = require('./models/ride'),
        GeoLocation = require('./models/geo-location'),	
        dbConfig = require('./configLoader').databaseConfig,
        connectionString = `mongodb://${dbConfig.host}/${dbConfig.database}`,
        connection = null;

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
			new Ride({'driverId':'987654321',
                      'phoneNumber': '036511231',
                      'seets':4,
                      'trempDateTime': new Date(),
                      'carModel': 'Mazda',
                      'sourceAddress': new GeoLocation({ "long": 30 , "lat": 31 }),
                      'destAddress': new GeoLocation({ "long": 36 , "lat": 35 }),
                      'imageName': 'blabla1.jpg',
                      'Passengers': ['123456', '654321']}),
            new Ride({'driverId':'12345654',
                      'phoneNumber': '031233212',
                      'seets':4,
                      'trempDateTime': new Date(),
                      'carModel': 'Mazda',
                      'sourceAddress': new GeoLocation({ "long": 31 , "lat": 32 }),
                      'destAddress': new GeoLocation({ "long": 34 , "lat": 33 }),
                      'imageName': 'blabla2.jpg',
                      'Passengers': ['123456', '654321']}),
            new Ride({'driverId':'22334455',
                      'phoneNumber': '031233212',
                      'seets':4,
                      'trempDateTime': new Date(),
                      'carModel': 'Mazda',
                      'sourceAddress': new GeoLocation({ "long": 33 , "lat": 34 }),
                      'destAddress': new GeoLocation({ "long": 32 , "lat": 31 }),
                      'imageName': 'blabla3.jpg',
                      'Passengers': ['123456', '654321']}),
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
        }
    }
}

module.exports = new DBSeeder();




