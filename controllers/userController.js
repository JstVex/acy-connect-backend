const User = require("../models/Users");
const Group = require("../models/Groups");
const Connection = require("../models/Connections")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose')

// get all users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
})

// get all users except current one
const getUsersExceptCurrent = asyncHandler(async (req, res) => {
    const currentUser = req.query.userId;

    try {
        const users = await User.find(({ _id: { $ne: currentUser } }));
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// get users not connected to the current user
const getUsersNotConnected = async (req, res) => {
    const userId = req.query.userId;

    try {
        // Find the current user
        const currentUser = await User.findById(userId);

        // Get the IDs of the users the current user has already connected with
        const connectedUserIds = currentUser.connections.map(connection => connection.toString());

        // Find all users who are not in the connectedUserIds array
        const unconnectedUsers = await User.find({
            connections: { $nin: connectedUserIds },
            _id: { $ne: userId }
        }).populate('connections');

        res.status(200).json(unconnectedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// get current user
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate('groups')
        .populate({
            path: 'events',
            populate: [
                { path: 'group' },
                { path: 'participants' }
            ]
        })
        .populate({
            path: 'connections',
            populate: [
                { path: 'user1' },
                { path: 'user2' }
            ]
        });
    res.status(200).json(user);
})

// get one user 
const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById({
        _id: userId
    }).populate('groups').populate('connections');

    res.status(200).json(user);
})

// get mutual friends within a group
const getMutualFriends = asyncHandler(async (req, res) => {
    const { userId, groupId } = req.params;
    try {
        const user = await User.findById(userId);
        const userConnections = user.connections.map(connection => connection.toString());

        const groupMembers = await User.find({ groups: { $in: [groupId] }, _id: { $ne: userId } }).lean();

        const mutualFriends = groupMembers.filter(member =>
            userConnections.includes(member._id.toString()) ||
            member.connections.some(connection =>
                userConnections.includes(connection.toString())
            )
        );

        res.status(200).json(mutualFriends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// register a new user 
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all the fields');
    }

    // checking if user already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400);
        throw new Error('User already exists')
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    try {
        const user = await User.create({ name, email, password: hashedPassword })
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // checking user's email and password
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials');
    }

    res.json({ message: 'Login User' })
});

// update user's profile information
const updateUser = asyncHandler(async (req, res) => {
    const { email, name, bio, fblink, hobbies, activeDay } = req.body;

    try {
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path;
        }

        const updatedUser = await User.findOneAndUpdate({
            email: email
        }, {
            name: name,
            image: imageUrl,
            bio: bio,
            fblink: fblink,
            hobbies: hobbies,
            activeDay: activeDay
        }, {
            new: true
        })

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// sending a connection request
const sendConnectionRequest = asyncHandler(async (req, res) => {
    const { senderId, recipientId } = req.body;

    try {
        const existingNotification = await User.findOne({
            _id: recipientId,
            notifications: {
                $elemMatch: {
                    type: 'connection_request',
                    sender: senderId,
                    recipient: recipientId,
                }
            }
        });

        if (existingNotification) {
            res.status(200).json(existingNotification);
        } else {
            const sender = await User.findById(senderId);
            const recipient = await User.findById(recipientId);

            const notification = {
                _id: new mongoose.Types.ObjectId(),
                type: 'connection_request',
                content: `${sender.name} wants to connect with you`,
                sender: senderId,
                recipient: recipientId,
            };

            const connectionNoti = await User.findByIdAndUpdate(recipientId, {
                $push: { notifications: notification }
            }, {
                new: true
            }).populate('notifications.sender notifications.recipient');
            res.status(200).json(connectionNoti)
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// sending group invitation
const sendGroupInvitation = asyncHandler(async (req, res) => {
    const { senderId, recipientId, groupId } = req.body;

    try {
        const existingNotification = await User.findOne({
            _id: recipientId,
            notifications: {
                $elemMatch: {
                    type: 'group_invitation',
                    sender: senderId,
                    recipient: recipientId,
                    group: groupId
                }
            }
        });

        if (existingNotification) {
            res.status(200).json(existingNotification);
        } else {
            const sender = await User.findById(senderId);
            const group = await Group.findById(groupId);

            const notification = {
                _id: new mongoose.Types.ObjectId(),
                type: 'group_invitation',
                content: `${sender.name} wants you to join Group '${group.title}'. Do you want to join?`,
                sender: senderId,
                recipient: recipientId,
                group: groupId
            };

            const groupInvitationNoti = await User.findByIdAndUpdate(recipientId, {
                $push: { notifications: notification }
            }, {
                new: true
            }).populate('notifications.sender notifications.group');
            res.status(200).json(groupInvitationNoti)
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// mark a notification as read
const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { 'notifications._id': notificationId },
            { $set: { 'notifications.$.status': 'read' } },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// removing notification 
const removeNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const { userId } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $pull: { notifications: { _id: notificationId } }
        }, { new: true });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// generating json web token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    getUsers,
    getUsersExceptCurrent,
    getUsersNotConnected,
    getMe,
    getUser,
    getMutualFriends,
    registerUser,
    loginUser,
    sendConnectionRequest,
    sendGroupInvitation,
    markNotificationAsRead,
    removeNotification,
    updateUser
}