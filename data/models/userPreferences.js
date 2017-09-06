const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const preferences = require('./preferences');

const UserPreferencesSchema = new Schema({
    userId: {type: String, required: true, unique: true},
    preferences: [ preferences.schema ]
});

module.exports = mongoose.model('userPreferences', UserPreferencesSchema);