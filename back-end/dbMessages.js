  
const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    message: String,
    sender: String,
    receiver: String,
    timestamp: String,
    status: String
});

// collection
module.exports =  mongoose.model('messagecontents', messageSchema);