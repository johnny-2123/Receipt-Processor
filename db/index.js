const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("receipts-db", "avilajohnny", "password", {
  dialect: "sqlite",
  host: "./dev.sqlite3",
});

module.exports = sequelize;
