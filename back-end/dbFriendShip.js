const mongoose = require('mongoose');

const friendShipSchema = mongoose.Schema({
    user: String,
    friend: String,
    timestamp: String,
});

module.exports = mongoose.model('friendshipdatas', friendShipSchema);