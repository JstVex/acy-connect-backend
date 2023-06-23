const express = require('express');
const {
    getUsers,
    getUsersExceptCurrent,
    getMe,
    registerUser,
    loginUser,
    updateUser
} = require("../controllers/userController");

const router = express();

const { protect } = require('../middleware/auth');

router.get('/', getUsers);

router.get('/exceptcurrent', getUsersExceptCurrent);

router.get('/me', protect, getMe);

router.post('/', registerUser);

router.post('/login', loginUser);

router.patch('/me', updateUser)

module.exports = router;