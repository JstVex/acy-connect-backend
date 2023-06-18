require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const groupsRoutes = require('./routes/groups');

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
        credentials: true
    })
)

app.use(express.json());
app.use(express.urlencoded());

app.use('/groups', groupsRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen('4080', () => {
            console.log('listening on port', 4080);
        })
    })
    .catch((error) => {
        console.log(error)
    })