const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const DATA_FILE = "data.json";

// Function to read data from data.json
function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Function to write data to data.json
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Route to get user XP
app.get("/get-xp/:username", (req, res) => {
    const username = req.params.username;
    const data = readData();
    const user = data.users.find(u => u.username === username);
    if (user) {
        res.json({ xp: user.xp, level: user.level });
    } else {
        res.json({ xp: 0, level: 1 });
    }
});

// Route to update user XP
app.post("/update-xp", (req, res) => {
    const { username, xp } = req.body;
    const data = readData();
    let user = data.users.find(u => u.username === username);

    if (user) {
        user.xp += xp;
        user.level = Math.floor(user.xp / 1000) + 1; // Level up every 1000 XP
    } else {
        user = { username, xp, level: 1 };
        data.users.push(user);
    }

    writeData(data);
    res.json({ message: "XP updated", xp: user.xp, level: user.level });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
