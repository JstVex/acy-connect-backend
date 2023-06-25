const User = require("../models/Users");
const Connection = require("../models/Connections")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

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
        console.log('currentuser is', currentUser)

        // Get the IDs of the users the current user has already connected with
        const connectedUserIds = currentUser.connections.map(connection => connection.toString());
        console.log('connetedUserIds', connectedUserIds)

        // Find all users who are not in the connectedUserIds array
        const unconnectedUsers = await User.find({
            _id: { $nin: [userId, ...connectedUserIds] }
        });

        console.log('unconnectedusers', unconnectedUsers)

        res.status(200).json(unconnectedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// const getUsersNotConnected = async (req, res) => {
//     const userId = req.query.userId;

//     try { 
//         const user = await User.findById(userId).p
//         console.log('user is', user)

//         const connections = await Connection.findOne({
//             user: userId
//         }).populate('connections');
//         console.log('connections', connections)

//         // Get the IDs of the connected users
//         // const connectedUserIds = user.connections.map((connection) => connection.users);
//         const connectedUserIds = await connections.map((connection) => connection._id).populate('users');
//         console.log('connected users are', connectedUserIds)

//         // Find all users who are not connected to the current user
//         const usersNotConnected = await User.find({
//             _id: { $ne: userId },
//             connections: { $nin: connectedUserIds },
//         });

//         res.status(200).json(usersNotConnected);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// get current user
const getMe = asyncHandler(async (req, res) => {
    // const { _id, name, email, image, fblink, hobbies, activeDay, groups } = await User.findById(req.user.id);
    const user = await User.findById(req.user.id).populate('groups');
    // res.status(200).json({
    //     id: _id,
    //     name,
    //     email
    // });
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
    const { profile } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate({
            email: profile.email
        }, {
            name: profile.name,
            image: profile.image,
            bio: profile.bio,
            fblink: profile.fblink,
            hobbies: profile.hobbies,
            activeDay: profile.activeDay
        }, {
            new: true
        })

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(400).json({ error: error.message })
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
    registerUser,
    loginUser,
    updateUser
}