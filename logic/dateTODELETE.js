//
// static getDateByDBFormant(dbFormat) {
//     let split = dbFormat.split(" ");
//     let time = split[1];
//     time = time.split(":");
//     if (time[1] < 10) {
//         time[1] = "0" + time[1];
//     }
//     time = time[0] + ":" + time[1] + ":00";
//     let date = split[0];
//     let dateAfterSplit = date.split("/");
//
//     let year = dateAfterSplit[2];
//     let month = dateAfterSplit[1];
//     if (month < 10) {
//         month = "0" + month;
//     }
//     let day = dateAfterSplit[0];
//     if (day < 10) {
//         day = "0" + day;
//     }
//     let dateInRealFormat = year + "-" + month + "-" + day + "T" + time;
//     return (new Date(dateInRealFormat));
// };
//
// static getDateByRequestFormant(reqFormat) {
//     let split = reqFormat.split("T");
//     let time = split[1];
//     time = time.split(":");
//     if (time[1] < 10) {
//         time[1] = "0" + time[1];
//     }
//     time = time[0] + ":" + time[1] + ":00";
//     let date = split[0];
//     let dateAfterSplit = date.split("/");
//
//     let year = dateAfterSplit[2];
//     let month = dateAfterSplit[1];
//     if (month < 10) {
//         month = "0" + month;
//     }
//     let day = dateAfterSplit[0];
//     if (day < 10) {
//         day = "0" + day;
//     }
//     let dateInRealFormat = year + "-" + month + "-" + day + "T" + time;
//     return (new Date(dateInRealFormat));
// };
//
// /**
//  * @return {boolean}
//  */
// static CheckIfRideIsInDate(requiredDate, rideDate) {
//
//     let TWO_HOURS = 60 * 60 * 1000 * 2;
//     let isRideInDate = false;
//     if ((rideDate - requiredDate < TWO_HOURS) && (requiredDate - rideDate < TWO_HOURS)) {
//         isRideInDate = true;
//     }
//
//     return isRideInDate;
// };
//
