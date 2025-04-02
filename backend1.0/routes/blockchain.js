const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { Blockchain } = require("../models");

function calculateHash(data) {
    return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

// Get all blockchain entries
router.get("/", async (req, res) => {
    try {
        const blockchainData = await Blockchain.find().sort({ timestamp: 1 });
        res.json(blockchainData);
    } catch (err) {
        console.error("Error fetching blockchain data:", err);
        res.status(500).json({ message: "Error fetching blockchain data", error: err.message });
    }
});

// Add a new blockchain entry
router.post("/", async (req, res) => {
    const { data } = req.body;
    try {
        const latestBlock = await Blockchain.findOne().sort({ timestamp: -1 });
        const previous_hash = latestBlock ? latestBlock.hash : "0000000000000000000000000000000000000000000000000000000000000000";
        const timestamp = new Date();
        const hash = calculateHash({ previous_hash, timestamp, data });

        const newBlock = new Blockchain({ previous_hash, data, hash, timestamp });
        await newBlock.save();
        res.status(201).json(newBlock);
    } catch (err) {
        console.error("Error adding blockchain entry:", err);
        res.status(500).json({ message: "Error adding blockchain entry", error: err.message });
    }
});

module.exports = router;
