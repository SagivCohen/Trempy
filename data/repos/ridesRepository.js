const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Ride = require('../models/ride');
      GeoLocation = require('../models/geo-location'),	
      usersRepo = require('./usersRepository');

class RidesRepository {
    //GET
    getRides(callback) {
        Ride.find({}, (err, rides) => {
            if (err) { 
                console.log(`(!) Failed to get all rides: ${err}`); 
                return callback(err); 
            }
            callback(null, rides);
        });
    }
    getRidesByParams(query, callback) {

        var location = query.src.split(",");
        var src = new GeoLocation({ "long": location[0] , "lat": location[1] });

        location = query.dst.split(",");
        var dst = new GeoLocation({ "long": location[0] , "lat": location[1] });

        var date = new Date(query.date);

        //TODO: Filter by Date (How much + and -)
        Ride.find({ 'driverId': query.fb_id,
                    'sourceAddress': src,
                    'destAddress': dst,
                    'trempDateTime': date }, (err, rides) => {
            if (err) { 
                console.log(`(!) Failed to get all rides: ${err}`); 
                return callback(err); 
            }
            callback(null, rides);
        });
    }
    getRidesByDriverId(driverId, callback) {

        Ride.find({ 'driverId': driverId }, (err, rides) => {
            if (err) { 
                console.log(`(!) Failed to get rides by driverId: ${err}`); 
                return callback(err); 
            }
            callback(null, rides);
        });
    }
    getRideById(id, callback) {

        Ride.findById(id, (err, ride) => {
            if (err) { 
                console.log(`(!) Failed to get ride by id: ${err}`); 
                return callback(err); 
            }
            callback(null, ride);
        });
    }

    //ADD
    addRide(body, callback) {
        var ride = new Ride({'driverId': body.driverId,
                'phoneNumber': body.phoneNumber,
                'seets':body.seets,
                'trempDateTime': new Date(),
                'carModel': body.carModel,
                'sourceAddress': new GeoLocation({ "long": body.sourceAddress.long , "lat": body.sourceAddress.lat }),
                'destAddress': new GeoLocation({ "long": body.destAddress.long , "lat": body.destAddress.lat }),
                'imageName': body.imageName,
                'Passengers': body.Passengers});

        ride.save((err, r) => {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    console.log('New Ride: [' + r._id +'] - ' + r.sourceAddress);
                    callback(null, r);
                }
            });
    }

    //UPDATE
    updateRide(id, body, callback) {

        //validate ride exist
        this.getRideById(id, (err, ride) => {
            if (err) { 
                console.log(`(!) Failed to get ride by id: ${err}`); 
                return callback(err); 
            }

            ride.phoneNumber = body.phoneNumber || ride.phoneNumber;
            ride.seets = body.seets || ride.seets;
            if(body.trempDateTime)
            {
                ride.phoneNumber = new Date(body.trempDateTime);
            }
            ride.carModel = body.carModel || ride.carModel;
            if(body.sourceAddress)
            {
                ride.sourceAddress = new GeoLocation({ "long": body.sourceAddress.long , "lat": body.sourceAddress.lat })
            }
            if(body.destAddress)
            {
                ride.destAddress = new GeoLocation({ "long": body.destAddress.long , "lat": body.destAddress.lat })
            }
            ride.imageName = body.imageName || ride.imageName;
            ride.Passengers = body.Passengers || ride.Passengers;

            ride.save((err, ride) => {
                if (err) { 
                    console.log(`(!) Failed to update a ride in DB: ${err}`); 
                    return callback(err, null); 
                }

                callback(null, ride);
            });
        });
    }
    joinRide(body, callback) {

        //TODO: validate user exist
        this.getRideById(body.rideId, (err, ride) => {
            if (err) { 
                console.log(`(!) Failed to get ride by id: ${err}`); 
                return callback(err); 
            }
            //TODO: return new 'reject'
            if(ride.seets < 1)
            {
                return callback(err);
            }
            ride.seets = ride.seets -1;
            ride.seets++;

            ride.save((err, ride) => {
                if (err) { 
                    console.log(`(!) Failed to update a ride in DB: ${err}`); 
                    return callback(err, null);
                }

                callback(null, ride);
            });
        });
    }
    unjoinRide(id, body, callback) {

        //validate ride exist
        this.getRideById(id, (err, ride) => {
            if (err) { 
                console.log(`(!) Failed to get ride by id: ${err}`); 
                return callback(err); 
            }

            ride.phoneNumber = body.phoneNumber || ride.phoneNumber;
            ride.seets = body.seets || ride.seets;
            if(body.trempDateTime)
            {
                ride.phoneNumber = new Date(body.trempDateTime);
            }
            ride.carModel = body.carModel || ride.carModel;
            if(body.sourceAddress)
            {
                ride.sourceAddress = new GeoLocation({ "long": body.sourceAddress.long , "lat": body.sourceAddress.lat })
            }
            if(body.destAddress)
            {
                ride.destAddress = new GeoLocation({ "long": body.destAddress.long , "lat": body.destAddress.lat })
            }
            ride.imageName = body.imageName || ride.imageName;
            ride.Passengers = body.Passengers || ride.Passengers;

            ride.save((err, ride) => {
                if (err) { 
                    console.log(`(!) Failed to update a ride in DB: ${err}`); 
                    return callback(err, null); 
                }

                callback(null, ride);
            });
        });
    }

    //DELETE
    deleteRide(id, callback) {

        Ride.remove({ '_id': id }, (err, ride) => {
            if (err) { 
                console.log(`(!) Failed to get delete ride: ${err}`); 
                return callback(err, null); 
            }
            callback(null, ride);
        });
    }
}

module.exports = new RidesRepository();

