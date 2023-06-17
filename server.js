const express = require('express');
const cors = require('cors');

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

app.listen('4080', () => {
    console.log('listening on port 4080')
})