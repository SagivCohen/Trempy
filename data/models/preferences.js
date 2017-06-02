const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const preferencesSchema = new Schema({
    mutualFriends: {type: Number, required: true },
    isFriends: {type: Number, required: true },
    distanceByMeters: {type: Number, required: true },
    isChosen: {type: Boolean, required: true }
}, {_id: false});

module.exports = mongoose.model('preferences', preferencesSchema);