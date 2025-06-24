const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Serve profile picture
app.get('/profile-picture', function (req, res) {
    const img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

// MongoDB connection strings
const mongoUrl = process.env.MONGO_URL || "mongodb://admin:password@localhost:27017";
const databaseName = "my-db";

// Update user profile
app.post('/update-profile', async function (req, res) {
    const userObj = req.body;
    userObj.userid = 1; // force-set userid to 1

    try {
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(databaseName);

        const myquery = { userid: 1 };
        const newvalues = { $set: userObj };

        await db.collection("users").updateOne(myquery, newvalues, { upsert: true });

        await client.close();
        res.send(userObj);
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).send({ error: "Database update error" });
    }
});

// Get user profile
app.get('/get-profile', async function (req, res) {
    try {
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(databaseName);

        const result = await db.collection("users").findOne({ userid: 1 });

        await client.close();
        res.send(result || {});
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).send({ error: "Database fetch error" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}`);
});
