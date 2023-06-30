const express = require('express');
const {
    getEvents,
    getEventsForGroup,
    createEvent
} = require("../controllers/eventController");

const router = express();

router.get('/', getEvents);

router.get('/:groupId', getEventsForGroup);

router.post('/', createEvent);

module.exports = router;