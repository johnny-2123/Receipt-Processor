const express = require("express");
const { Receipt, Item } = require("../db/index.js");

const router = express.Router();

router.get("/:id/points", async (req, res) => {
  const { id } = req.params;

  try {
    const receipt = await Receipt.scope("points").findByPk(id);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found." });
    }

    const points = await receipt.getPoints();

    return res.status(200).json({ points });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/process", async (req, res) => {
  const { retailer, purchaseDate, purchaseTime, total, items } = req.body;

  try {
    const newReceipt = await Receipt.scope("defaultScope").create({
      retailer,
      purchaseDate,
      purchaseTime,
      total,
    });

    items.forEach((item) => {
      item.receiptId = newReceipt.id;
    });
    await Item.bulkCreate(items);

    const receipt = await Receipt.findByPk(newReceipt.id);
    return res.status(201).json(receipt);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const receipts = await Receipt.findAll({
      include: [
        {
          model: Item,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    return res.status(200).json(receipts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
