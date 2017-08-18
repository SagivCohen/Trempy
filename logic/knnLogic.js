/**
 * Created by efrat netanya on 26/05/2017.
 */
kNN = require("k.n.n");
let request = require('request');
let distanceLogic = require('distanceLogic');
// require.config({
//     shim: {
//         'facebook' : {
//             exports: 'FB'
//         }
//     },
//     paths: {
//         'facebook': '//connect.facebook.net/en_US/sdk'
//     }
// })
// require(['fb']);

class knnLogic {
    constructor() {
    }

    getRidesByKnn(userId, srcLocation, destLocation, reqDate, rides, userPreferences) {
        if (userPreferences.length > 0) {
            let oldPreferences = this.initOldPreferencesToKNN(userPreferences);
            let model = new kNN(oldPreferences);
            let returnRides = [];
            let currentSourceDistance;
            let currentDestDistance;
            let currentAccuracy;

            for (let ride of rides) {
                let isFriends = this.checkIsFriends(userId, ride.driverId);
                let numOfMutualFriends = this.getNumOfMutualFriends(userId, ride.driverId);

                // If they are'nt friends or they hadn't mutual friends then dont return this ride
                if (isFriends || numOfMutualFriends) {
                    currentSourceDistance = distanceLogic.getDistanceFromLatLonInKm(requireSrcLocation.lat, requireSrcLocation.long, ride.sourceAddress.lat, ride.sourceAddress.long);

                    if (currentSourceDistance < 10000) {
                        currentDestDistance = distanceLogic.getDistanceFromLatLonInKm(requireDestLocation.lat, requireDestLocation.long, ride.destAddress.lat, ride.destAddress.long);

                        if (currentDestDistance < 10000) {
                            // let isRideInDate = this.CheckIfRideIsInDate(this.getDateByRequestFormant(reqDate), this.getDateByDBFormant(ride.trempDateTime));
                            // if (isRideInDate) {
                            currentAccuracy = model.launch(3, new kNN.Node({
                                isFriends: isFriends,
                                mutualFriends: numOfMutualFriends,
                                sourceDistance: currentSourceDistance,
                                destDistance: currentSourceDistance,
                                type: false
                            }));

                            returnRides.push({
                                currentAccuracy: currentAccuracy,
                                ride: ride,
                                isFriends: isFriends,
                                mutualFriends: numOfMutualFriends,
                                sourceDistance: currentSourceDistance,
                                destDistance: currentSourceDistance
                            })
                        }
                    }
                }
            }
        } else {
            return
        }

    }

    initOldPreferencesToKNN(userPreferences) {
        let data = [];
        for (let userPreference of userPreferences) {
            data.push(new kNN.Node({
                isFriends: userPreference.preferences.isFriends,
                mutualFriends: userPreference.mutualFriends,
                distanceByMeters: userPreference.distanceByMeters,
                type: userPreference.isChosen
            }))
        }
        return data;
    }

    checkIsFriends(userId, driverId) {
        FB.api(userId + "/friends/" + driverId,
            function (response) {
                if (response && !response.error) {
                    /* handle the result */
                }
            }
        );
    }

    getNumOfMutualFriends(userId, driverId) {

    }

}
module.exports = new knnLogic();
//
//     let accuracy = getAcuurayForEachTremp();
// }
// //send to client the request list
// // sort by accuracy
//
// // the client chosen tremp
// // add the new recognition to training set pf specific user
//
//
//


// function getAcuurayForEachTremp() {
//
// }
//
//
// let data = [new kNN.Node({paramA: 1, paramB: 300, type: 'typeA'}),
//     new kNN.Node({paramA: 3, paramB: 350, type: 'typeA'}),
//     new kNN.Node({paramA: 6, paramB: 1200, type: 'typeB'}),
//     new kNN.Node({paramA: 8, paramB: 900, type: 'typeB'})]
//
// let example = new kNN(data);
//
// let results = example.launch(3, new kNN.Node({paramA: 4, paramB: 350, type: false}));
//
// console.log(results.type + ": " + results.percentage + "%");

// let srcLocation = {
//     long: 33.10231,
//     lat: 35.03462
// };
// let destLocation = {
//     long: 34.10231,
//     lat: 36.03462
// };


// function calcDistanceBetweenLocations(srcLocation, destLocation, callback) {
//     // request(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${srcLocation.lat},${srcLocation.long}|${destLocation.lat},${destLocation.long}&destinations=${ride.sourceAddress.lat},${ride.sourceAddress.long}|${ride.destAddress.lat},${ride.destAddress.long}&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`,
//     // request(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=31.9704041,34.771769|31.3704041,34.771769&destinations=32.237793,34.840278|32.137793,34.840278&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`,
//     request(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=31.9704041,34.771769|31.3704041,40.77176&destinations=32.237793,34.840278|32.137793,34.840278&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`,
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
//
// let count = 0;
// calcDistanceBetweenLocations({}, {}, (ride)=> {
//     if (ride) {
//         count++;
//         console.log(count);
//     }
// });
