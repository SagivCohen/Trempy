const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Preference = require('../models/preferences');
UserPreference = require('../models/userPreferences');

class PreferencesRepository {

	getPreferencesByUserId(id, callback) {

		UserPreference.find({
			'userId': id
		}, (err, preferences) => {
			if (err) {
				console.log(`(!) Failed to get userPreferences: ${err}`);
				return callback(err);
			}
			callback(null, preferences);
		});
	}


	addPreferencesToUser(body, callback) {

		let id = body.userId;
		let index = body.choose_index;
		var preferences = [];
		var srcPref = JSON.parse(body.Source_Array_preferences);
		srcPref[index].type = "Choose"
		for (var i = 0; i < srcPref.length; i++) {

			var pref = new Preference({
				'mutualFriends': srcPref[i].mutualFriends,
				'isFriends': srcPref[i].isFriends,
				'sourceDistance': srcPref[i].sourceDistance,
				'destDistance': srcPref[i].destDistance,
				'type': srcPref[i].type
			});

			preferences.push(pref);
		}

		UserPreference.find({
			'userId': id
		}, (err, userPreferences) => {
			if (err) {
				console.log(`(!) Failed to get userPreferences: ${err}`);
				return callback(err, null);
			}

			if (userPreferences.length > 0 ) {
				userPreferences[0].preferences = userPreferences[0].preferences.concat(preferences)

                userPreferences = userPreferences[0];
				
			} else {
				userPreferences = new UserPreference({
					'userId': body.userId,
					'preferences': preferences
				});
			}

			userPreferences.save((err, p) => {
				if (err) {
					console.log(err);
					callback(err, null);
				} else {
					console.log(p);
					callback(null, p);
				}
			});
		});

	}

}

module.exports = new PreferencesRepository();