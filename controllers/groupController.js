const Group = require("../models/Groups");
const User = require("../models/Users");

// get all groups
const getGroups = async (req, res) => {
    const groups = await Group.find({});
    res.status(200).json(groups);
}

// create a new group 
const createGroup = async (req, res) => {
    const { title, description, owner, time, date, place, groupLink, members, events } = req.body;

    try {
        const group = await Group.create({ title, description, owner, time, date, place, groupLink, members, events })

        const updatedUser = await User.findOneAndUpdate({
            _id: owner
        }, {
            $addToSet: { groups: group._id }
        },
            { new: true }
        )
        res.status(200).json({ group, updatedUser });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// update when a new user join
const userJoinGroup = async (req, res) => {
    const { user, id } = req.body;

    try {
        const updatedGroup = await Group.findOneAndUpdate({
            _id: id
        }, {
            $addToSet: { members: user }
        },
            { new: true }
        )

        const updatedUser = await User.findOneAndUpdate({
            _id: user
        }, {
            $addToSet: { groups: id }
        },
            { new: true }
        )

        res.status(200).json({ updatedGroup, updatedUser });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getGroups,
    createGroup,
    userJoinGroup
}