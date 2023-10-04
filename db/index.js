const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("receipts-db", "avilajohnny", "password", {
  dialect: "sqlite",
  host: "./db/dev.sqlite3",
});

const models = {
  Receipt: require("./models/receipt")(sequelize),
  Item: require("./models/item")(sequelize),
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = { sequelize, ...models };
