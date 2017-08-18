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

}
module.exports = new distanceLogic();

s = new Date("1991-05-30T16:29:00");
d = new Date("1991-05-30T18:28:00");
//console.log(CheckIfRideIsInDate(getDateByDBFormant("7/5/2017 12:13:14"), getDateByDBFormant("7/5/2017 12:13:14")));

