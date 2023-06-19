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
    fblink: {
        type: String
    },
    hobbies: {
        type: String
    },
    activeDay: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);