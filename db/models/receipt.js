const { Model, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../index.js");

class Receipt extends Model {
  static associate(models) {
    Receipt.hasMany(models.Item, {
      foreignKey: "receiptId",
      onDelete: "CASCADE",
    });
  }
}

Receipt.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4(),
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
    defaultScope: {
      attributes: {
        exclude: [
          "retailer",
          "purchaseDate",
          "purchaseTime",
          "createdAt",
          "updatedAt",
        ],
      },
    },
  }
);

module.exports = Receipt;
