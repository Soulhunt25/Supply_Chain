/*const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const auth = require("../middleware/auth");

router.get("/protected-route", auth, (req, res) => {
  res.send({ message: "This is a protected route", user: req.user })
});

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role: role || "user" });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", userId: newUser._id, role: newUser.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Logged in successfully", token, role: user.role, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username role");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
*/
const express = require("express");
const router = express.Router();
const db = require("../db");
const crypto = require("crypto");

function calculateHash(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM blockchain ORDER BY timestamp"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching blockchain data:", err);
    res
      .status(500)
      .json({ message: "Error fetching blockchain data", error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { data } = req.body;
  try {
    const latestBlock = await db.query(
      "SELECT * FROM blockchain ORDER BY timestamp DESC LIMIT 1"
    );
    const previous_hash =
      latestBlock.rows.length > 0
        ? latestBlock.rows[0].hash
        : "0000000000000000000000000000000000000000000000000000000000000000";
    const timestamp = new Date().toISOString();
    const hash = calculateHash({ previous_hash, timestamp, data });

    const result = await db.query(
      "INSERT INTO blockchain (previous_hash, data, hash, timestamp) VALUES ($1, $2, $3, $4) RETURNING *",
      [previous_hash, JSON.stringify(data), hash, timestamp]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding blockchain entry:", err);
    res
      .status(500)
      .json({ message: "Error adding blockchain entry", error: err.message });
  }
});

module.exports = router;
