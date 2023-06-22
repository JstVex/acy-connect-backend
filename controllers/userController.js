const User = require("../models/Users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

// get all user
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
})

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

// generating json web token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    getUsers,
    getMe,
    registerUser,
    loginUser
}