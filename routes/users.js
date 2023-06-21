const express = require('express');
const {
    getUsers,
    getMe,
    registerUser,
    loginUser
} = require("../controllers/userController");

const router = express();

const { protect } = require('../middleware/auth');

router.get('/', getUsers);

router.get('/me', protect, getMe);

router.post('/', registerUser);

router.post('/login', loginUser);

module.exports = router;