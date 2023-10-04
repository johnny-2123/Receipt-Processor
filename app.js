const express = require("express");
const sequelize = require("./db/index.js");

sequelize.sync({ force: true }).then(() => {
  console.log("Database schema synchronized.");
});

const app = express();

app.get("/test", (req, res) => {
  return res.status(200).json({ message: "Test Route" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
