const express = require('express');
const {
    getGroups,
    createGroup,
    userJoinGroup
} = require("../controllers/groupController");

const router = express();

router.get('/', getGroups);

router.post('/', createGroup);

router.post('/join', userJoinGroup);

module.exports = router;