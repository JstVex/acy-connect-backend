const Event = require("../models/Events");
const Group = require("../models/Groups");
const User = require("../models/Users");

// get all events
const getEvents = async (req, res) => {
    const events = await Event.find({});
    res.status(200).json(events);
}

// get events for one group
const getEventsForGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const events = await Event.find({
            group: groupId
        })
        res.status(200).json(events);

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// create a new event 
const createEvent = async (req, res) => {
    const { title, description, date, time, group } = req.body;

    try {
        const event = await Event.create({ title, description, date, time, group });

        const updatedGroup = await Group.findOneAndUpdate({
            _id: group
        }, {
            $addToSet: { events: event._id }
        },
            { new: true }
        );

        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// update participants when a new user participates
const updateParticipants = async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;

    try {
        const updatedEvent = await Event.findOneAndUpdate({
            _id: eventId
        }, {
            $addToSet: { participants: userId }
        },
            { new: true }
        );

        const updatedUser = await User.findOneAndUpdate({
            _id: userId
        }, {
            $addToSet: { events: eventId }
        }, {
            new: true
        })

        res.status(200).json(updatedEvent)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// remove user from participants when they quit an event
const removeParticipant = async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;

    try {
        const updatedEvent = await Event.findOneAndUpdate({
            _id: eventId
        }, {
            $pull: { participants: userId }
        },
            { new: true }
        );

        const updatedUser = await User.findOneAndUpdate({
            _id: userId
        }, {
            $pull: { events: eventId }
        },
            { new: true }
        );

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get events for all the groups user has joined
const getEventsForAllGroups = async (req, res) => {
    const { userId } = req.params;

    try {
        // Retrieve the user document with populated groups and events field
        const user = await User.findById(userId).populate('groups').populate('events');

        // Get an array of group IDs from the user's groups field
        const groupIds = user.groups.map(group => group._id);

        // Get an array of event IDs that the user has already participated in
        const participatedEventIds = user.events.map(event => event._id);

        // Find events where the group field matches any of the group IDs
        const events = await Event.find(
            {
                _id: { $nin: participatedEventIds },
                group: { $in: groupIds }
            }
        );

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getEvents,
    getEventsForGroup,
    getEventsForAllGroups,
    createEvent,
    updateParticipants,
    removeParticipant
}