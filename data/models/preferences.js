const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const preferencesSchema = new Schema({
    mutualFriends: {type: Number, required: true },
    isFriends: {type: Number},
    sourceDistance: {type: Number, required: true },
    destDistance: {type: Number, required: true },
    type: {type: String, required: true }
}, {_id: false});

module.exports = mongoose.model('preferences', preferencesSchema);