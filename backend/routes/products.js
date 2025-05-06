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
const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticateToken } = require("../middleware/auth"); // ✅ Corrected import
const roleAuth = require("../middleware/roleAuth");

// Get all products (accessible to all authenticated users)
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Add a new product (accessible only to admin and manager roles)
router.post("/", authenticateToken, roleAuth(["admin", "manager"]), async (req, res) => {
  const { name, description, sku } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO products (name, description, sku) VALUES ($1, $2, $3) RETURNING *",
      [name, description, sku]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding product" });
  }
});

module.exports = router;
