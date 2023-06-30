const Event = require("../models/Events");
const Group = require("../models/Groups");

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
    console.log('group id is', group)

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

module.exports = {
    getEvents,
    getEventsForGroup,
    createEvent
}