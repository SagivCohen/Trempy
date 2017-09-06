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

    getRidesByKnn(userId, srcLocation, destLocation, rides, userPreferences, callback) {
        let returnRides = [];
        if (userPreferences.length > 0) {
            let oldPreferences = this.initOldPreferencesToKNN(userPreferences);
            let model = new kNN(oldPreferences);

            let currentSourceDistance;
            let currentDestDistance;
            let currentAccuracy;

            for (let ride of rides) {
                let isFriends = this.checkIsFriends(userId, ride.driverId);
                let numOfMutualFriends = this.getNumOfMutualFriends(userId, ride.driverId);

                // If they are'nt friends or they hadn't mutual friends then dont return this ride
                if (isFriends || numOfMutualFriends) {
                    currentSourceDistance = distanceLogic.getDistanceFromLatLonInKm(srcLocation.lat, srcLocation.long, ride.sourceAddress.lat, ride.sourceAddress.long);

                    if (currentSourceDistance < 10000) {
                        currentDestDistance = distanceLogic.getDistanceFromLatLonInKm(destLocation.lat, destLocation.long, ride.destAddress.lat, ride.destAddress.long);

                        if (currentDestDistance < 10000) {
                            currentAccuracy = model.launch(30, new kNN.Node({
                                // isFriends: isFriends,
                                // mutualFriends: numOfMutualFriends,
                                sourceDistance: currentSourceDistance,
                                destDistance: currentDestDistance,
                                type: false
                            }));

                            returnRides.push({
                                currentAccuracy: currentAccuracy,
                                ride: ride,
                                isFriends: isFriends,
                                mutualFriends: numOfMutualFriends,
                                sourceDistance: currentSourceDistance,
                                destDistance: currentDestDistance,
                                type: "noChosen"
                            })
                        }
                    }
                }
            }

            let resultRides = returnRides.sort(this.compare);

            return callback(resultRides);
        } else {
            for (let ride of rides) {
                let isFriends = this.checkIsFriends(userId, ride.driverId);
                let numOfMutualFriends = this.getNumOfMutualFriends(userId, ride.driverId);

                // If they are'nt friends or they hadn't mutual friends then dont return this ride
                if (isFriends || numOfMutualFriends) {
                    let currentSourceDistance = distanceLogic.getDistanceFromLatLonInKm(srcLocation.lat, srcLocation.long, ride.sourceAddress.lat, ride.sourceAddress.long);

                    if (currentSourceDistance < 10000) {
                        let currentDestDistance = distanceLogic.getDistanceFromLatLonInKm(destLocation.lat, destLocation.long, ride.destAddress.lat, ride.destAddress.long);

                        if (currentDestDistance < 10000) {

                            returnRides.push({
                                ride: ride,
                                // isFriends: isFriends,
                                // mutualFriends: numOfMutualFriends,
                                sourceDistance: currentSourceDistance,
                                destDistance: currentDestDistance,
                                type: "noChosen"
                            })
                        }
                    }
                }
            }
            return callback(returnRides);
        }
    }

    compare(a, b) {
        let aPercentage;
        let bPercentage;
        console.log("A: " + a.currentAccuracy.percentage + " !!! " + a.currentAccuracy.type+ " B: " + b.currentAccuracy.percentage + " !!!! " +b.currentAccuracy.type);
        if (a.currentAccuracy.type === "noChosen") {
            aPercentage = 1 - a.currentAccuracy.percentage;
        } else {
            aPercentage = a.currentAccuracy.percentage;
        }

        if (b.currentAccuracy.type === "noChosen") {
            bPercentage = 1 - b.currentAccuracy.percentage;
        } else {
            bPercentage = b.currentAccuracy.percentage;
        }

        return bPercentage - aPercentage;
    }

    initOldPreferencesToKNN(userPreferences) {
        let data = [];
        for (let userPreference of userPreferences[0].preferences) {

            for (let index = 0; index < 30; index++) {
                let element = userPreference._doc[index];

                data.push(new kNN.Node({
                    // isFriends: element.isFriends,
                    // mutualFriends: element.mutualFriends,
                    sourceDistance: element.sourceDistance,
                    destDistance: element.destDistance,
                    type: element.type
                }))
            }
        }
        return data;
    }

    checkIsFriends(userId, driverId) {
        // FB.api(userId + "/friends/" + driverId,
        //     function (response) {
        //         if (response && !response.error) {
        //             /* handle the result */
        //         }
        //     }
        // );
        return Math.floor(Math.random() * 2);
    }

    getNumOfMutualFriends(userId, driverId) {
        return Math.floor((Math.random() * 100) + 1);
    }

}
module.exports = new knnLogic();


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


