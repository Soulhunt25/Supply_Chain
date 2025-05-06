/*const express = require("express");
const router = express.Router();
const { Order } = require("../models");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

router.post("/", auth, async (req, res) => {
  const { product_id, quantity, status } = req.body;
  try {
    const newOrder = new Order({ product_id, quantity, status });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Error creating order" });
  }
});

module.exports = router;
*/
//const { authenticateToken } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all orders
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Create a new order
router.post("/", async (req, res) => {
  const { product_id, quantity, status } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO orders (product_id, quantity, status) VALUES ($1, $2, $3) RETURNING *",
      [product_id, quantity, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating order" });
  }
});

module.exports = router;
