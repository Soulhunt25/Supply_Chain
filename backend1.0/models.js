const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  sku: { type: String, unique: true, required: true },
});

const orderSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const blockchainSchema = new mongoose.Schema({
  previous_hash: { type: String, required: true },
  data: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
  hash: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);
const Blockchain = mongoose.model("Blockchain", blockchainSchema);

module.exports = { User, Product, Order, Blockchain };
