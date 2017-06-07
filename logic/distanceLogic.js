/**
 * Created by efrat netanya on 26/05/2017.
 */
kNN = require("k.n.n");
let request = require('request');

class distanceLogic {

    constructor() {
    }

    getRidesByDistance(srcLocation, destLocation, rides, callback) {
        let returnRides = {};
        for (let ride of rides) {
            this.calcDistanceBetweenLocations(srcLocation, destLocation, (isTooClose)=> {
                if (isTooClose) {
                    returnRides.add(ride);
                }
            });
        }
        callback(returnRides);
    }

    calcDistanceBetweenLocations(srcLocation, destLocation, callback) {
        request(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${srcLocation.lat},${srcLocation.long}&destinations=${destLocation.lat},${destLocation.long}&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let bodyJson = JSON.parse(body);
                    let distnaceByMeters = -1;
                    if (bodyJson.rows && bodyJson.rows[0].elements && bodyJson.rows[0].elements[0].distance) {
                        distnaceByMeters = bodyJson.rows[0].elements[0].distance.value;

                        if (distnaceByMeters < 10000) {
                            callback(true);
                        }
                    }
                }

                callback(false);
            })
    }
}


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
// });
