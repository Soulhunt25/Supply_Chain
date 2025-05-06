const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const blockchainRoutes = require("./routes/blockchain");

const app = express();
const PORT = process.env.PORT || 5001;

// Debug: log JWT_SECRET value
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not set. Check your .env file or environment variables.");
} else {
  console.log("✅ JWT_SECRET is loaded.");
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("🚀 API is running..."));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blockchain", blockchainRoutes);

// Error handler (optional, but useful)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
