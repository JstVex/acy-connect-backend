const mongoose = require('mongoose');

const Schema = mongoose.Schema

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group"
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
})

module.exports = mongoose.model('Event', eventSchema);