const express = require('express');
const {
    getEvents,
    getEventsForGroup,
    getEventsForAllGroups,
    createEvent,
    updateParticipants,
    removeParticipant
} = require("../controllers/eventController");

const router = express();

router.get('/', getEvents);

router.get('/:groupId', getEventsForGroup);

router.get('/user/:userId', getEventsForAllGroups);

router.post('/', createEvent);

router.patch('/:eventId', updateParticipants);

router.delete('/:eventId', removeParticipant)

module.exports = router;