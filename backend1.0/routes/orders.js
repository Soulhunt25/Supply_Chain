const express = require("express");
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
