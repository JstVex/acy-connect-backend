// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const connectionSchema = new Schema({
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     connections: [{
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     }]
// })

// module.exports = mongoose.model('Connection', connectionSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    user1: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Connection', connectionSchema);
