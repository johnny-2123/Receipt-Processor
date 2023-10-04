const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { Item } = require("../index.js");

module.exports = (sequelize) => {
  class Receipt extends Model {
    static associate(models) {
      Receipt.hasMany(models.Item, {
        foreignKey: "receiptId",
        onDelete: "CASCADE",
      });
    }

    static async getPoints() {
      const { id } = this;
      const items = await Item.findAll({
        where: { receiptId: id },
      });

      const total = items.reduce((acc, item) => {
        return acc + items.price;
      }, 0);

      return { points: total };
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
      total: {
        type: DataTypes.FLOAT,
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
            "total",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    }
  );

  return Receipt;
};
