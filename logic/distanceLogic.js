let request = require('request');

class distanceLogic {

    constructor() {
    }

    /**
     * @return {boolean}
     */

    getDateByDBFormant(dbFormat) {
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


    getRidesByQuery(requireSrcLocation, requireDestLocation, reqDate, rides, callback) {

        let returnRides = [];
        let ridesCounter = 0;
        for (let ride of rides) {

            this.calcDistanceBetweenLocations(requireSrcLocation, requireDestLocation, ride, (isTooClose)=> {
                ridesCounter++;

                if (isTooClose) {
                    let isRideInDate = this.CheckIfRideIsInDate(this.getDateByDBFormant(reqDate), ride.trempDateTime);
                    if (isRideInDate){
                        this.returnRides.push(ride);
                    }
                }
                if (ridesCounter === rides.length) {
                    callback(returnRides);
                }
            });
        }
    }

    calcDistanceBetweenLocations(srcLocation, destLocation, ride, callback) {
        request(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${srcLocation.lat},${srcLocation.long}|${destLocation.lat},${destLocation.long}&destinations=${ride.sourceAddress.lat},${ride.sourceAddress.long}|${ride.destAddress.lat},${ride.destAddress.long}&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let bodyJson = JSON.parse(body);
                    let sourceDistance = -1;
                    let destinationDistance = -1;
                    if ((bodyJson.rows !== undefined) &&
                        (bodyJson.rows[0].elements !== undefined) &&
                        (bodyJson.rows[0].elements[0].distance !== undefined) &&
                        (bodyJson.rows[1] !== undefined) &&
                        (bodyJson.rows[1].elements[1] !== undefined) &&
                        (bodyJson.rows[1].elements[1].distance !== undefined)) {
                        sourceDistance = bodyJson.rows[0].elements[0].distance.value;
                        destinationDistance = bodyJson.rows[1].elements[1].distance.value;


                        if (sourceDistance < 10000 && destinationDistance < 10000) {
                            callback(true);
                        }
                    }
                }

                callback(false);
            })
    }


}
module.exports = new distanceLogic();


// request(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=40.6655101,-73.89188969999998&destinations=40.6905615%2C-73.9976592%7C&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`, function (error, response, body) {
// request(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=31.9704041,34.771769&destinations=32.137793,34.840278&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`,
//     function (error, response, body) {
// srcLocation.lat = 31.9704041;
// srcLocation.long = 34.771769;
// destLocation.lat = 32.137793;
// destLocation.long = 34.840278;

// let count = 0;
// calcDistanceBetweenLocations({}, {}, (ride)=> {
//     if (ride) {
//         count++;
//         console.log(count);
//     }
// // });
// let simpleRides = {
// {
//     sourceAddress = 1,
//         destAddress = 2
// }
// }
// distanceLogic().getRidesByDistance()


s = new Date("1991-05-30T16:29:00");
d = new Date("1991-05-30T18:28:00");
console.log(CheckIfRideIsInDate(getDateByDBFormant("7/5/2017 12:13:14"), getDateByDBFormant("7/5/2017 12:13:14")));

