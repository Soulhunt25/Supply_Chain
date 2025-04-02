const express = require("express");
const router = express.Router();
const { Product } = require("../models");
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

router.post("/", auth, roleAuth(["admin", "manager"]), async (req, res) => {
  const { name, description, sku } = req.body;
  try {
    const newProduct = new Product({ name, description, sku });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error adding product" });
  }
});

module.exports = router;
