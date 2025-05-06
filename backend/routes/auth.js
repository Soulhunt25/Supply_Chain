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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

// ✅ FIXED: Destructure the middleware function from the module
const { authenticateToken } = require("../middleware/auth");

// Protected route example
router.get("/protected-route", authenticateToken, (req, res) => {
  res.send({ message: "This is a protected route", user: req.user });
});

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const userCheck = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, role",
      [username, hashedPassword, role || "user"]
    );
    res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].id,
      role: result.rows[0].role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("Login attempt for user:", username);
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    console.log("Database query result:", result.rows);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log("User found:", user.username, "Role:", user.role);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);
      if (isMatch) {
        const token = jwt.sign(
          { userId: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        console.log("JWT created:", token);
        res.json({
          message: "Logged in successfully",
          token,
          role: user.role,
          userId: user.id,
        });
      } else {
        console.log("Password does not match");
        res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      console.log("User not found");
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Get all users
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT id, username, role FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
