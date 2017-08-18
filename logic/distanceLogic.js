let request = require('request');

class distanceLogic {

    constructor() {
    }

    getRidesByDistance(requireSrcLocation, requireDestLocation, rides, callback) {
        let returnRides = [];
        let ridesCounter = 0;
        for (let ride of rides) {
            this.calcDistanceBetweenLocations(requireSrcLocation, requireDestLocation, ride, (isTooClose) => {
                ridesCounter++;
                if (isTooClose) {
                    returnRides.push(ride);
                }
                if (ridesCounter === rides.length) {
                    callback(returnRides);
                }
            });
        }

    }

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

    // calcDistanceBetweenLocations(srcLocation, destLocation, ride, callback) {
    //     request(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${srcLocation.lat},${srcLocation.long}|${destLocation.lat},${destLocation.long}&destinations=${ride.sourceAddress.lat},${ride.sourceAddress.long}|${ride.destAddress.lat},${ride.destAddress.long}&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`,
    //         function (error, response, body) {
    //             if (!error && response.statusCode == 200) {
    //                 let bodyJson = JSON.parse(body);
    //                 let sourceDistance = -1;
    //                 let destinationDistance = -1;
    //                 if ((bodyJson.rows !== undefined) &&
    //                     (bodyJson.rows[0].elements !== undefined) &&
    //                     (bodyJson.rows[0].elements[0].distance !== undefined) &&
    //                     (bodyJson.rows[1] !== undefined) &&
    //                     (bodyJson.rows[1].elements[1] !== undefined) &&
    //                     (bodyJson.rows[1].elements[1].distance !== undefined)) {
    //                     sourceDistance = bodyJson.rows[0].elements[0].distance.value;
    //                     destinationDistance = bodyJson.rows[1].elements[1].distance.value;
    //
    //
    //                     if (sourceDistance < 10000 && destinationDistance < 10000) {
    //                         callback(true);
    //                     }
    //                 }
    //             }
    //
    //             callback(false);
    //         })
    // }

    getDateByDBFormant = (dbFormat) => {
        split = dbFormat.split(" ");
        time = split[1];
        date = split[0];
        dateAfterSplit = date.split("/");

        let year = dateAfterSplit[2];
        let month = dateAfterSplit[1];
        if (month < 10) {
            month = "0" + month;
        }
        let day = dateAfterSplit[0];
        if (day < 10) {
            day = "0" + day;
        }
        dateInRealFormat = year + "-" + month + "-" + day + "T" + time;
        return (new Date(dateInRealFormat));
    };

    CheckIfRideIsInDate = (requiredDate, rideDate) => {

        var TWO_HOURS = 60 * 60 * 1000 * 2;
        if ((rideDate - requiredDate < TWO_HOURS) && (requiredDate - rideDate < TWO_HOURS)) {

            return true;
        }
        else {
            return false
        }
    };
}
module.exports = new distanceLogic();

s = new Date("1991-05-30T16:29:00");
d = new Date("1991-05-30T18:28:00");
console.log(CheckIfRideIsInDate(getDateByDBFormant("7/5/2017 12:13:14"), getDateByDBFormant("7/5/2017 12:13:14")));

