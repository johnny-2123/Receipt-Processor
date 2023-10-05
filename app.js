const express = require("express");
const { ValidationError } = require("sequelize");
const { sequelize } = require("./db/index.js");
const routes = require("./routes/index.js");

// Ensure the database schema is in sync with the models
sequelize.sync().then(() => {
  console.log("Database schema synchronized.");
});

const app = express();
app.use(express.json());
app.use(routes);

// Middleware to handle sequelize validation errors
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = "Sequelize Validation Error";
  }
  next(err);
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
