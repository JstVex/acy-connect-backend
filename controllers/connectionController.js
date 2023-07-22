const Connection = require("../models/Connections");
const User = require("../models/Users");

const getAllConnectionsForCurrentUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const connections = await Connection.find({
            $or: [{ user1: userId }, { user2: userId }]
        }).populate("user1").populate("user2");

        const userConnections = connections.map(connection => {
            const connectedUser = connection.user1._id.toString() === userId
                ? connection.user2
                : connection.user1;

            return {
                connectionId: connection._id,
                connectedUser
            };
        });

        res.status(200).json(userConnections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// get connection between two users
const getConnectionBetweenTwoUsers = async (req, res) => {
    const { user1Id, user2Id } = req.params;

    try {
        const connection = await Connection.findOne({
            $or: [
                {
                    user1: user1Id,
                    user2: user2Id
                }
                , {
                    user1: user2Id,
                    user2: user1Id
                }
            ]
        }).populate("user1").populate("user2")
        res.status(200).json(connection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// create a new connection between two users
const createConnection = async (req, res) => {
    const { user1Id, user2Id, notificationId } = req.body;

    try {
        // Check if the connection already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { user1: user1Id, user2: user2Id },
                { user1: user2Id, user2: user1Id }
            ]
        });

        if (existingConnection) {
            return res.status(409).json({ error: "Connection already exists" });
        }

        const connection = await Connection.create({
            user1: user1Id,
            user2: user2Id
        });

        await User.findByIdAndUpdate(user1Id, {
            $addToSet: { connections: connection._id }
        });

        await User.findByIdAndUpdate(user2Id, {
            $addToSet: { connections: connection._id }
        });

        await User.findByIdAndUpdate(user1Id, {
            $pull: { notifications: { _id: notificationId } }
        }, { new: true });

        res.status(201).json(connection);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete connection
const deleteConnection = async (req, res) => {
    const { connectionId } = req.params;
    const { user1Id, user2Id } = req.body;

    try {
        await User.findByIdAndUpdate(user1Id, {
            $pull: { connections: connectionId }
        });

        await User.findByIdAndUpdate(user2Id, {
            $pull: { connections: connectionId }
        });

        const connection = await Connection.findByIdAndDelete(connectionId)

        res.status(201).json(connection);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getAllConnectionsForCurrentUser,
    getConnectionBetweenTwoUsers,
    createConnection,
    deleteConnection
}