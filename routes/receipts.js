const express = require("express");
const Receipt = require("../db/models/receipt.js");

const router = express.Router();

router.post("/", async (req, res) => {
  let { retailer, purchaseDate, purchaseTime } = req.body;

  try {
    const receipt = await Receipt.create({
      retailer,
      purchaseDate,
      purchaseTime,
    });
    return res.status(201).json({ receipt });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const receipts = await Receipt.findAll();
    return res.status(200).json({ receipts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
