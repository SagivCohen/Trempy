let request = require('request');

export class distanceLogic {

    constructor() {
    }

    getRidesByDistance(requireSrcLocation, requireDestLocation, rides, callback) {
        let returnRides = {};
        let ridesCounter = 0;
        for (let ride of rides) {
            this.calcDistanceBetweenLocations(requireSrcLocation, requireDestLocation, ride, (isTooClose)=> {
                if (isTooClose) {
                    returnRides.push(ride);
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
                    if (bodyJson.rows && bodyJson.rows[0].elements && bodyJson.rows[0].elements[0].distance &&
                        bodyJson.rows[1] && bodyJson.rows[1].elements[1] && bodyJson.rows[0].elements[1].distance) {
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