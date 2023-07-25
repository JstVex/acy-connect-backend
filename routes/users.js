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
    markNotificationAsRead,
    removeNotification,
    updateUser
} = require("../controllers/userController");
const { upload } = require('../middleware/multer')

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

router.patch('/notifications/markasread/:notificationId', markNotificationAsRead);

router.delete('/notifications/:notificationId', removeNotification);

router.patch('/me', upload.single('image'), updateUser);

module.exports = router;