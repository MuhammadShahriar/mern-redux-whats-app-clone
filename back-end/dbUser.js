const mongoose = require('mongoose');

const userIdSchema = mongoose.Schema({
    uid: String,
    name: String,
    email: String,
    photoUrl: String,
    singedIn: Boolean,
});

module.exports = mongoose.model('userdatas', userIdSchema);