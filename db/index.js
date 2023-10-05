const { Sequelize } = require("sequelize");

// Create sequelize instance
const sequelize = new Sequelize("receipts-db", "avilajohnny", "password", {
  dialect: "sqlite",
  // Define path to database file
  host: "./db/dev.sqlite3",
});

// Define Associate models with sequelize instance
const models = {
  Receipt: require("./models/receipt")(sequelize),
  Item: require("./models/item")(sequelize),
};

// Create associations between models
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = { sequelize, ...models };
