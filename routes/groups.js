const express = require('express');
const {
    getGroups,
    getGroup,
    getUnjoinedGroups,
    createGroup,
    userJoinGroup,
    userLeaveGroup
} = require("../controllers/groupController");

const router = express();

router.get('/', getGroups);

router.get('/:groupId', getGroup);

router.get('/unjoined/:userId', getUnjoinedGroups)

router.post('/', createGroup);

router.patch('/join', userJoinGroup);

router.delete('/leave', userLeaveGroup);

module.exports = router;