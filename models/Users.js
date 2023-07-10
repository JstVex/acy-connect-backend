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
    }],
    notifications: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            recipient: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            group: {
                type: Schema.Types.ObjectId,
                ref: 'Group'
            },
            event: {
                type: Schema.Types.ObjectId,
                ref: 'Event'
            },
            status: {
                type: String,
                enum: ['unread', 'read', 'approved', 'declined'],
                default: 'unread',
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);