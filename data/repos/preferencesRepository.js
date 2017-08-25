const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    userPreferences = require('../models/userPreferences');

class preferencesRepository {
    //GET

    getUserPreferences(userId, callback) {
        userPreferences.find({'userId': userId}, (err, userPreferences) => {
            if (err) {
                console.log(`(!) Failed to get all rides: ${err}`);
                return callback(err);
            }
            callback(null, userPreferences);
        });
    }

    //ADD
     createOrUpdateUserPreferences(userId, body, callback) {
        let currentPreferences = body.preferences;
        currentPreferences[body.index].type = "chosen";

        userPreferences.update({'userId': userId},
            {$push: {userPreferences: currentPreferences}},
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

