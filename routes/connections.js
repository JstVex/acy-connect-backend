const express = require('express');
const {
    getAllConnectionsForCurrentUser,
    getConnectionBetweenTwoUsers,
    createConnection,
    deleteConnection
} = require("../controllers/connectionController");

const router = express();

router.get('/foruser/:userId', getAllConnectionsForCurrentUser);

router.get('/:user1Id/:user2Id', getConnectionBetweenTwoUsers);

router.post('/', createConnection);

router.delete('/:connectionId', deleteConnection);

module.exports = router;