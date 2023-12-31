const express = require("express");
const { Receipt, Item } = require("../db/index.js");
const { handleValidationErrors } = require("../utils/validation.js");
const { check } = require("express-validator");

// Validation Middleware for POST /process
const validateReceipt = [
  check("retailer")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for retailer."),
  check("retailer").isString().withMessage("Retailer must be a string."),
  check("purchaseDate")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for purchaseDate."),
  check("purchaseTime")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for purchaseTime."),
  check("purchaseTime").isTime().withMessage("Purchase time must be a time."),
  check("total")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for total."),
  check("total").isNumeric().withMessage("Total must be a number."),
  handleValidationErrors,
];

const router = express.Router();

// Finds a receipt by id and returns an object specifying the points awarded for the receipt
router.get("/:id/points", async (req, res) => {
  const { id } = req.params;

  try {
    const receipt = await Receipt.scope("points").findByPk(id);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found." });
    }

    return res.status(200).json(receipt);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Creates a new receipt, calculates the points awarded for the receipt, and returns the receipt id
router.post("/process", validateReceipt, async (req, res) => {
  const { retailer, purchaseDate, purchaseTime, total, items } = req.body;

  try {
    const newReceipt = await Receipt.create({
      retailer,
      purchaseDate,
      purchaseTime,
      total,
    });

    // Set the receiptId for each item and bulk create the associated items
    items.forEach((item) => {
      item.receiptId = newReceipt.id;
    });
    await Item.bulkCreate(items);

    await newReceipt.calculateAndSetPoints();

    const receipt = await Receipt.findByPk(newReceipt.id);
    return res.status(201).json(receipt);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Returns all receipts and their associated items - used for testing
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
