const express = require('express');
const {
    getUsers,
    getUsersExceptCurrent,
    getUsersNotConnected,
    getMe,
    getUser,
    registerUser,
    loginUser,
    updateUser
} = require("../controllers/userController");

const router = express();

const { protect } = require('../middleware/auth');

router.get('/', getUsers);

router.get('/exceptcurrent', getUsersExceptCurrent);

router.get('/notconnect', getUsersNotConnected);

router.get('/me', protect, getMe);

router.get('/:userId', getUser);

router.post('/', registerUser);

router.post('/login', loginUser);

router.patch('/me', updateUser)

module.exports = router;