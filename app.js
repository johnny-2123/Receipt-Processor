const express = require("express");
const { ValidationError } = require("sequelize");
const { sequelize } = require("./db/index.js");
const routes = require("./routes/index.js");

sequelize.sync({ force: true }).then(() => {
  console.log("Database schema synchronized.");
});

const app = express();
app.use(express.json());
app.use(routes);

app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = "Sequelize Validation Error";
  }
  next(err);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
