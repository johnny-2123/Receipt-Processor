const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  return res.status(200).json({ message: "Test Route" });
});

module.exports = router;
