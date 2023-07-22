const Group = require("../models/Groups");
const User = require("../models/Users");

// get all groups
const getGroups = async (req, res) => {
    const groups = await Group.find({}).populate('owner').populate('events');
    res.status(200).json(groups);
}

// get a single group by id
const getGroup = async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findById({
        _id: groupId
    }).populate('members').populate('owner');

    res.status(200).json(group);
}

// get groups that user haven't joined yet
const getUnjoinedGroups = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        const userGroups = user.groups.map(group => group.toString());
        console.log('userGroups', userGroups)

        const unjoinedGroups = await Group.find(
            {
                _id: { $nin: userGroups }
            }).populate('owner').populate('events');
        console.log('unjoined groups', unjoinedGroups)

        res.status(200).json(unjoinedGroups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

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

// update when a user left
const userLeaveGroup = async (req, res) => {
    const { user, id } = req.body;

    try {
        const updatedGroup = await Group.findOneAndUpdate({
            _id: id
        }, {
            $pull: { members: user }
        },
            { new: true }
        )

        const updatedUser = await User.findOneAndUpdate({
            _id: user
        }, {
            $pull: { groups: id }
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
    getGroup,
    getUnjoinedGroups,
    createGroup,
    userJoinGroup,
    userLeaveGroup
}