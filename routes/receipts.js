const express = require("express");
const { Receipt, Item } = require("../db/index.js");

const router = express.Router();

router.post("/", async (req, res) => {
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
            exclude: ["createdAt", "updatedAt", "receiptId"],
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
