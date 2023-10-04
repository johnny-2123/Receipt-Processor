const express = require("express");
const { sequelize } = require("./db/index.js");
const routes = require("./routes/index.js");

sequelize.sync({ force: true }).then(() => {
  console.log("Database schema synchronized.");
});

const app = express();
app.use(express.json());
app.use(routes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
