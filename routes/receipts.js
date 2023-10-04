const express = require("express");
const Receipt = require("../db/models/receipt.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { retailer, purchaseDate, purchaseTime } = req.body;

  try {
    const newReceipt = await Receipt.scope("defaultScope").create({
      retailer,
      purchaseDate,
      purchaseTime,
    });

    const receipt = await Receipt.findByPk(newReceipt.id);
    return res.status(201).json(receipt);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const receipts = await Receipt.findAll();
    return res.status(200).json(receipts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
