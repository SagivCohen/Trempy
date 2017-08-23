/**
 * Created by efrat netanya on 26/05/2017.
 */
kNN = require("k.n.n");
let request = require('request');
let distanceLogic = require('./distanceLogic');
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

            return returnRides.sort(this.compare);
        } else {
            return rides;
        }


    }

    compare(a, b) {
        let aPercentage;
        let bPercentage;
        if (a.currentAccuracy.type === "NotChosen") {
            aPercentage = 1 - a.currentAccuracy.percentage;
        } else {
            aPercentage = a.currentAccuracy.percentage;
        }

        if (b.currentAccuracy.type === "NotChosen") {
            bPercentage = 1 - b.currentAccuracy.percentage;
        } else {
            bPercentage = b.currentAccuracy.percentage;
        }

        return bPercentage - aPercentage;
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

