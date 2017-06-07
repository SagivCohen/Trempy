/**
 * Created by efrat netanya on 26/05/2017.
 */
kNN = require("k.n.n");
let request = require('request');
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

    getRidesByKnn(userId, srcLocation, destLocation, rides, userPreferences) {
        if (userPreferences.length > 0) {
            let oldPreferences = this.initOldPreferencesToKNN(userPreferences);
            let model = new kNN(oldPreferences);

            for (let ride of rides) {
                let isFriends = this.checkIsFriends(userId, ride.driverId);
                let numOfMutualFriends = this.getNumOfMutualFriends(userId, ride.driverId);

                // If they are'nt friends or they hadn't mutual friends then dont return this ride
                if (isFriends || numOfMutualFriends) {
                    let distance = calcDistanceBetweenLocations(srcLocation, destLocation);

                    if (distance < 10000) {
                        let currentAcuuracy = model.launch(3, new kNN.Node({
                            isFreinds: isFriends,
                            mutualFriends: numOfMutualFriends,
                            distanceByMeters: distance,
                            type: false
                        }));
                    }
                }
            }
        } else {
            // TODO
        }

    }

    initOldPreferencesToKNN(userPreferences) {
        let data = [];
        for (let userPreference of userPreferences) {
            data.push(new kNN.Node({
                isFreinds: userPreference.preferences.isFriends,
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
function calcDistanceBetweenLocations(srcLocation, destLocation, callback) {

    // request(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=40.6655101,-73.89188969999998&destinations=40.6905615%2C-73.9976592%7C&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`, function (error, response, body) {
    // request(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=31.9704041,34.771769&destinations=32.137793,34.840278&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`,
    //     function (error, response, body) {
    srcLocation.lat = 31.9704041;
    srcLocation.long = 34.771769;
    destLocation.lat = 32.137793;
    destLocation.long = 34.840278;
    request(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${srcLocation.lat},${srcLocation.long}&destinations=${destLocation.lat},${destLocation.long}&key=AIzaSyCv_G3rQ0Samqso1wFwfYOksSxZZaVRSI8`,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let bodyJson = JSON.parse(body);
                let distnaceByMeters = -1;
                if (bodyJson.rows && bodyJson.rows[0].elements && bodyJson.rows[0].elements[0].distance) {
                    distnaceByMeters = bodyJson.rows[0].elements[0].distance.value;
                    console.log(bodyJson); // Print the google web page.
                    callback("hi");
                }
            }
        })
}
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
let count = 0;
calcDistanceBetweenLocations({}, {}, (ride)=> {
    if (ride) {
        count++;
        console.log(count);
    }
});