const { Model, DataTypes } = require("sequelize");
const sequelize = require("../index.js");
const { v4: uuidv4 } = require("uuid");

class Receipt extends Model {}

Receipt.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    retailer: {
      type: DataTypes.STRING,
    },
    purchaseDate: {
      type: DataTypes.DATE,
    },
    purchaseTime: {
      type: DataTypes.TIME,
    },
  },
  {
    sequelize,
    modelName: "Receipt",
  }
);
