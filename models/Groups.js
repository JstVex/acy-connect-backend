const mongoose = require('mongoose');

const Schema = mongoose.Schema

const groupSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    time: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
    place: {
        type: String,
        enums: ['lobby', 'cafeteria', 'outside', 'library']
    },
    groupLink: {
        type: String
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    events: [{
        type: Schema.Types.ObjectId,
        red: "Event"
    }]
})

module.exports = mongoose.model('Group', groupSchema);