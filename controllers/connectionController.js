const Connection = require("../models/Connections");
const User = require("../models/Users");

// get all connections except target user
const getAllConnections = async (req, res) => {
    const { userId } = req.params;

    try {
        const connections = await Connection.find({ user: { $ne: userId } }).populate('connections', 'name');
        res.status(200).json(connections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// get all connections for current user

// const getAllConnectionsForCurrentUser = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const connections = await Connection.findOne({
//             user: userId
//         }).populate('connections');

//         res.status(200).json(connections);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

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


// create a new connection 

// const createConnection = async (req, res) => {
//     const { userId, connectionId } = req.body;

//     const connectionExists = await Connection.findOne({ user: userId })

//     if (connectionExists) {
//         try {
//             const updatedConnection = await Connection.findOneAndUpdate({
//                 user: userId
//             }, {
//                 $addToSet: { connections: connectionId }
//             },
//                 { new: true }
//             )

//             await User.findByIdAndUpdate(userId, {
//                 $addToSet: {
//                     connections: connectionId
//                 }
//             })

//             res.status(201).json(updatedConnection)
//         } catch (error) {
//             res.status(400).json({ error: error.message })
//         }
//     } else {
//         try {
//             const connection = await Connection.create({
//                 user: userId,
//                 connections: [connectionId]
//             })

//             await User.findByIdAndUpdate(userId, {
//                 $addToSet: {
//                     connections: connectionId
//                 }
//             })

//             res.status(201).json(connection)
//         } catch (error) {
//             res.status(400).json({ error: error.message })
//         }
//     }
// }

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
            $addToSet: { connections: user2Id }
        });

        await User.findByIdAndUpdate(user2Id, {
            $addToSet: { connections: user1Id }
        });

        await User.findByIdAndUpdate(user1Id, {
            $pull: { notifications: { _id: notificationId } }
        }, { new: true });

        res.status(201).json(connection);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllConnections,
    getAllConnectionsForCurrentUser,
    createConnection
}