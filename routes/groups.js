const express = require('express');
const {
    getGroups,
    createGroup
} = require("../controllers/groupController");

const router = express();

router.get('/', getGroups);

router.post('/', createGroup);

module.exports = router;