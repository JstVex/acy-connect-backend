const Group = require("../models/Groups");

// get all groups
const getGroups = async (req, res) => {
    const groups = await Group.find({});
    res.status(200).json(groups);
}

// create a new group 
const createGroup = async (req, res) => {
    const { title, description, owner, ownerId, time, date, place, groupLink, members, events } = req.body;

    try {
        const group = await Group.create({ title, description, owner, ownerId, time, date, place, groupLink, members, events })
        res.status(200).json(group)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getGroups,
    createGroup
}