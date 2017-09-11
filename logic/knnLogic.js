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

    getRidesByKnn(extendedRides, userPreferences, callback) {
        let returnRides = [];
        if (userPreferences.length > 0) {
            let oldPreferences = this.initOldPreferencesToKNN(userPreferences);
            let model = new kNN(oldPreferences);

            let currentAccuracy;

            for (let extendedRide of extendedRides) {
                currentAccuracy = model.launch(30, new kNN.Node({
                    isFriends: extendedRide.isFriends,
                    mutualFriends: extendedRide.numOfMutualFriends,
                    sourceDistance: extendedRide.currentSourceDistance,
                    destDistance: extendedRide.currentDestDistance,
                    type: false
                }));

                returnRides.push({
                    currentAccuracy: currentAccuracy,
                    ride: extendedRide.ride,
                    isFriends: extendedRide.isFriends,
                    mutualFriends: extendedRide.numOfMutualFriends,
                    sourceDistance: extendedRide.currentSourceDistance,
                    destDistance: extendedRide.currentDestDistance,
                    type: "noChosen"
                })
            }

            let resultRides = returnRides.sort(this.compare);

            return callback(resultRides);
        } else {

            for (let extendedRide of extendedRides) {
                if(extendedRide.mutualFriends !== null){
                    returnRides.push(extendedRide);
                }
            }
            return callback(returnRides);
        }
    }

    filterRidesByDistance(allRides, srcLocation, destLocation, callback) {
        let returnRides = []

        for (let ride of allRides) {
            var currentSourceDistance = distanceLogic.getDistanceFromLatLonInKm(srcLocation.lat, srcLocation.long, ride.sourceAddress.lat, ride.sourceAddress.long);

            if (currentSourceDistance < 10000) {
                var currentDestDistance = distanceLogic.getDistanceFromLatLonInKm(destLocation.lat, destLocation.long, ride.destAddress.lat, ride.destAddress.long);

                if (currentDestDistance < 10000) {

                    returnRides.push({
                        ride: ride,
                        isFriends: null,
                        mutualFriends: null,
                        sourceDistance: currentSourceDistance,
                        destDistance: currentDestDistance,
                        type: "noChosen"
                    })
                }
            }
        }

        return callback(null, returnRides);
    }


    compare(a, b) {
        let aPercentage;
        let bPercentage;
        // console.log("A: " + a.currentAccuracy.percentage + " !!! " + a.currentAccuracy.type + " B: " + b.currentAccuracy.percentage + " !!!! " + b.currentAccuracy.type);
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
            data.push(new kNN.Node({
                isFriends: userPreference.isFriends,
                mutualFriends: userPreference.mutualFriends,
                sourceDistance: userPreference.sourceDistance,
                destDistance: userPreference.destDistance,
                type: userPreference.type
            }))
        }
        return data;
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


