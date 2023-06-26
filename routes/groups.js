const express = require('express');
const {
    getGroups,
    getGroup,
    createGroup,
    userJoinGroup
} = require("../controllers/groupController");

const router = express();

router.get('/', getGroups);

router.get('/:groupId', getGroup);

router.post('/', createGroup);

router.post('/join', userJoinGroup);

module.exports = router;