const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    bio: {
        type: String
    },
    fblink: {
        type: String
    },
    hobbies: {
        type: String
    },
    activeDay: {
        type: String
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: "Group"
    }],
    connections: [{
        type: Schema.Types.ObjectId,
        ref: "Connection"
    }],
    events: [{
        type: Schema.Types.ObjectId,
        ref: "Event"
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);