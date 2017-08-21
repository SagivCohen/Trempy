const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Ride = require('../models/ride');
      GeoLocation = require('../models/geo-location'),
          dateformat = require('dateformat'),
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

    //TODO: 2n hours befor+after

    // getRidesByDate(dbDate, callback) {
    //     var TWO_HOURS = 60 * 60 * 1000 * 2;
    //     var parsedDate = new Date(Date.parse(dbDate))
    //     var gteDate = new Date(parsedDate.getTime() - TWO_HOURS);
    //     var ltDate = new Date(parsedDate.getTime() + TWO_HOURS);
    //
    //     console.log("gteDate:  " + gteDate.toString());
    //     console.log("ltDate:  " + ltDate.toString());
    //
    //     Ride.find({trempDateTime: {
    //         $gte:gteDate.toString(),
    //         $lt: ltDate.toString()
    //     }}, (err, rides) => {
    //         if (err) {
    //             console.log(`(!) Failed to get all rides: ${err}`);
    //             return callback(err);
    //         }
    //         callback(null, rides);
    //     });
    // }
    getRidesByDateAvia(dbDate) {
        let splitDate = dbDate.split(" ");
        let date = splitDate[0];
        let time = splitDate[1];
        let splitTime =  time.split(":");
        let hour =  parseInt(splitTime[0]);
        let minutes = splitTime[1];
        let seconds = splitTime[2];

        // var gteDate = dateFormat.setHours(dateFormat.getHours() - 2);
        // var ltDate =dateFormat.setHours(dateFormat.getHours() + 2);
        console.log("DB date:  " + dbDate.toString());

        var gteDate = date + " " + (hour-2).toString() + ":" + minutes + ":"+seconds;
        var ltDate =date + " " + (hour+2).toString() + ":" + minutes + ":"+seconds;;
        console.log("gteDate:  " + gteDate.toString());
        console.log("ltDate:  " + ltDate.toString());

       Ride.find({trempDateTime: {
            $gte:gteDate.toString(),
            $lt: ltDate.toString()
        }}, (err, rides) => {
            if (err) {
                console.log(`(!) Failed to get all rides: ${err}`);
            }
           callback(null, rides);
        });
    }

    getDateByDBFormant(dbFormat) {
        console.log("dbFormat" + dbFormat);
        let split = dbFormat.split(" ");
        let time = split[1];

        time = time.split(":");
        if (time[1] < 10) {
            time[1] = "0" + time[1];
        }
        time = time[0] + ":" + time[1] + ":00";
        let date = split[0];
        let dateAfterSplit = date.split("/");

        let year = dateAfterSplit[2];
        let month = dateAfterSplit[1];
        if (month < 10) {
            month = "0" + month;
        }
        let day = dateAfterSplit[0];
        if (day < 10) {
            day = "0" + day;
        }
        let dateInRealFormat = year + "-" + month + "-" + day + " " + time;
        return (new Date(dateInRealFormat));
    };

    getDateByRequestFormant(reqFormat) {
        let split = reqFormat.split("T");
        let time = split[1];
        time = time.split(":");
        if (time[1] < 10) {
            time[1] = "0" + time[1];
        }
        time = time[0] + ":" + time[1] + ":00";
        let date = split[0];
        let dateAfterSplit = date.split("/");

        let year = dateAfterSplit[2];
        let month = dateAfterSplit[1];
        if (month < 10) {
            month = "0" + month;
        }
        let day = dateAfterSplit[0];
        if (day < 10) {
            day = "0" + day;
        }
        let dateInRealFormat = year + "-" + month + "-" + day + "T" + time;
        return (new Date(dateInRealFormat));
    };

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
    getJoinedRidesByUserId(userId, callback) {

        Ride.find({ 'Passengers': userId }, (err, rides) => {
            if (err) {
                console.log(`(!) Failed to get joined rides by userId: ${err}`);
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
                'trempDateTime': body.trempDateTime,
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
            ride.trempDateTime = body.trempDateTime || ride.trempDateTime;
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
            //TODO: return 'reject' (No room for new trempist)
            if(ride.seets < 1)
            {
                return callback(err);
            }

            ride.seets = ride.seets -1;
            ride.Passengers.push(body.userId);

            ride.save((err, ride) => {
                if (err) { 
                    console.log(`(!) Failed to update a ride in DB: ${err}`); 
                    return callback(err, null);
                }

                callback(null, ride);
            });
        });
    }
    unjoinRide(body, callback) {

        //TODO: validate user exist
        this.getRideById(body.rideId, (err, ride) => {
            if (err) { 
                console.log(`(!) Failed to unjoin ride: ${err}`);
                return callback(err); 
            }

            //TODO: return 'reject' (No room for new trempist)
            if(ride.Passengers.indexOf(body.userId) < 0)
            {
                return callback(err);
            }

            ride.seets = ride.seets +1;
            console.log(ride.Passengers);
            ride.Passengers.splice(ride.Passengers.indexOf(body.userId),1);
            console.log(ride.Passengers);

            ride.save((err, ride) => {
                if (err) { 
                    console.log(`(!) Failed to unjoin ride: ${err}`);
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

