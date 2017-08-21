let request = require('request');

class distanceLogic {

    constructor() {
    }

    // getRidesByDistance(requireSrcLocation, requireDestLocation, reqDate, rides, callback) {
    //     let returnRides = [];
    //     let ridesCounter = 0;
    //
    //     let currentSourceDistance;
    //     let currentDestDistance;
    //     for (let ride of rides) {
    //         currentSourceDistance = this.getDistanceFromLatLonInKm(requireSrcLocation.lat, requireSrcLocation.long, ride.sourceAddress.lat, ride.sourceAddress.long);
    //
    //         if (currentSourceDistance < 10000) {
    //             currentDestDistance = this.getDistanceFromLatLonInKm(requireDestLocation.lat, requireDestLocation.long, ride.destAddress.lat, ride.destAddress.long);
    //             ridesCounter++;
    //
    //             if (currentDestDistance < 10000) {
    //                 let isRideInDate = this.CheckIfRideIsInDate(this.getDateByRequestFormant(reqDate), this.getDateByDBFormant(ride.trempDateTime));
    //                 if (isRideInDate) {
    //                     returnRides.push(ride);
    //                 }
    //             }
    //         }
    //     }
    //
    //     return returnRides;
    // }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        let R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = deg2rad(lon2 - lon1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // Distance in km
        return d;
    }

    static deg2rad(deg) {
        return deg * (Math.PI / 180)
    }


    getDateByDBFormant(dbFormat){
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
        let dateInRealFormat = year + "-" + month + "-" + day + "T" + time;
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

    /**
     * @return {boolean}
     */
    CheckIfRideIsInDate(requiredDate, rideDate) {

        var TWO_HOURS = 60 * 60 * 1000 * 2;
        let isRideInDate = false;
        if ((rideDate - requiredDate < TWO_HOURS) && (requiredDate - rideDate < TWO_HOURS)) {
            isRideInDate = true;
        }

        return isRideInDate;
    };

    getRidesByDistance(requireSrcLocation, requireDestLocation, reqDate, rides, callback) {
        let returnRides = [];
        let ridesCounter = 0;
        for (let ride of rides) {
            this.calcDistanceBetweenLocations(requireSrcLocation, requireDestLocation, ride, (isTooClose)=> {
                ridesCounter++;
                if (isTooClose) {
                    let isRideInDate = this.CheckIfRideIsInDate(this.getDateByRequestFormant(reqDate), this.getDateByDBFormant(ride.trempDateTime));
                    if (isRideInDate) {
                        returnRides.push(ride);
                    }
                }
                // console.log("counter: " + ridesCounter + " rides length: " + rides.length);
                if (ridesCounter === rides.length) {
                    callback(returnRides);
                }
            });
        }
    }

    // getRidesByDistance(requireSrcLocation, requireDestLocation, reqDate, rides, callback) {
    //     let returnRides = [];
    //     let ridesCounter = 0;
    //     for (let ride of rides) {
    //         // this.calcDistanceBetweenLocations(requireSrcLocation, requireDestLocation, ride, (isTooClose)=> {
    //         ridesCounter++;
    //         // if (isTooClose) {
    //         let isRideInDate = this.CheckIfRideIsInDate(this.getDateByRequestFormant(reqDate), this.getDateByDBFormant(ride.trempDateTime));
    //         if (isRideInDate) {
    //             returnRides.push(ride);
    //         }
    //         // }
    //         // console.log("counter: " + ridesCounter + " rides length: " + rides.length);
    //         if (ridesCounter === rides.length) {
    //             callback(returnRides);
    //         }
    //         // });
    //     }
    // }

    calcDistanceBetweenLocations(srcLocation, destLocation, ride, callback) {
        var srcDist = this.getDistannceByCoordinate(srcLocation.lat, srcLocation.long, ride.sourceAddress.lat, ride.sourceAddress.long);
        console.log('src:' + srcDist);

        var dstDist = this.getDistannceByCoordinate(destLocation.lat, destLocation.long, ride.destAddress.lat, ride.destAddress.long);
        console.log('dst:' + dstDist);

        if(srcDist<10 && srcDist<10)
        {
            return callback(true);
        }
        return callback(false);
    }

    getDistannceByCoordinate(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;
        var c = Math.cos;
        var a = 0.5 -c((lat2-lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1-c((lon2-lon1) * p))/2;

        return 12742 * Math.asin(Math.sqrt(a));
    }


    //
    //Retreive distance by Google API
    //

    // calcDistanceBetweenLocations(srcLocation, destLocation, ride, callback) {
    //     request(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${srcLocation.lat},${srcLocation.long}|${destLocation.lat},${destLocation.long}&destinations=${ride.sourceAddress.lat},${ride.sourceAddress.long}|${ride.destAddress.lat},${ride.destAddress.long}&key=AIzaSyCJYcUl2wVwPwh_NsAv7p9dgHPVjFkysX8`,
    //         function (error, response, body) {
    //             if (!error && response.statusCode == 200) {
    //                 let bodyJson = JSON.parse(body);
    //                 let sourceDistance = -1;
    //                 let destinationDistance = -1;
    //                 // console.log(ride._id);
    //                 // console.log(bodyJson.rows[0])
    //                 // console.log(bodyJson.rows[1])
    //                 if ((bodyJson.rows !== undefined) &&
    //                     (bodyJson.rows[0].elements !== undefined) &&
    //                     (bodyJson.rows[0].elements[0].distance !== undefined) &&
    //                     (bodyJson.rows[1] !== undefined) &&
    //                     (bodyJson.rows[1].elements[1] !== undefined) &&
    //                     (bodyJson.rows[1].elements[1].distance !== undefined)) {
    //                     sourceDistance = bodyJson.rows[0].elements[0].distance.value;
    //                     destinationDistance = bodyJson.rows[1].elements[1].distance.value;
    //                     // console.log("source: " + sourceDistance + " \ndest: "   + destinationDistance)


    //                     if (sourceDistance < 10000 && destinationDistance < 10000) {
    //                         return callback(true);
    //                     }
    //                 }
    //             }

    //             return callback(false);
    //         })
    // }

}
module.exports = new distanceLogic();

s = new Date("1991-05-30T16:29:00");
d = new Date("1991-05-30T18:28:00");
//console.log(CheckIfRideIsInDate(getDateByDBFormant("7/5/2017 12:13:14"), getDateByDBFormant("7/5/2017 12:13:14")));

