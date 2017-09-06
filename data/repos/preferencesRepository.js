const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    userPreferences = require('../models/userPreferences');

class preferencesRepository {
    //GET

    getUserPreferences(userId, callback) {
        userPreferences.find({'userId': userId}, (err, userPreferencesResult) => {
            if (err) {
                console.log(`(!) Failed to get all rides: ${err}`);
                return callback(err);
            }
            callback(null, userPreferencesResult);
        });
    }

    //ADD
     createOrUpdateUserPreferences(userId ,chooseIndex, preferences, callback) {
        preferences[chooseIndex].type = "chosen";
        userPreferences.update({'userId': userId},
            {$push: {"preferences": preferences}},
            {upsert: true},
            (err, userPreferences) => {
                if (err) {
                    console.log(`(!) Failed to update preferences: ${err}`);
                    return callback(err);
                }
                callback(null, true);
            }
        )
    }
}

module.exports = new preferencesRepository();

