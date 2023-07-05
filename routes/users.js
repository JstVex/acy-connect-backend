const express = require('express');
const {
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
    updateUser
} = require("../controllers/userController");

const router = express();

const { protect } = require('../middleware/auth');

router.get('/', getUsers);

router.get('/exceptcurrent', getUsersExceptCurrent);

router.get('/notconnect', getUsersNotConnected);

router.get('/me', protect, getMe);

router.get('/:userId', getUser);

router.get('/mutualfriends/:userId/:groupId', getMutualFriends);

router.post('/', registerUser);

router.post('/login', loginUser);

router.patch('/friendrequest', sendConnectionRequest);

router.patch('/groupinvitation', sendGroupInvitation);

router.patch('/me', updateUser);

module.exports = router;