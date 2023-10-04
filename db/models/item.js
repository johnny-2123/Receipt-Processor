const { Model, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../index.js");

class Item extends Model {
  static associate(models) {
    Item.belongsTo(models.Receipt, {
      foreignKey: "receiptId",
      onDelete: "CASCADE",
    });
  }
}

Item.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4(),
      primaryKey: true,
    },
    receiptId: {
      type: DataTypes.UUID,
    },
    shortDescription: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
    },
  },
  {
    sequelize,
    modelName: "Item",
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    },
  }
);
