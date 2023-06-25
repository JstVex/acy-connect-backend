const express = require('express');
const {
    getAllConnections,
    getAllConnectionsForCurrentUser,
    createConnection
} = require("../controllers/connectionController");

const router = express();

router.get('/exceptuser/:userId', getAllConnections);

router.get('/foruser/:userId', getAllConnectionsForCurrentUser);

router.post('/', createConnection)

module.exports = router;