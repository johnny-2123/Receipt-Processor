const { Model, DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
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
