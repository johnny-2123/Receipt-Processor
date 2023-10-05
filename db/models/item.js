const { Model, DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
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
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
      shortDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
          isNumeric: true,
        },
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

  return Item;
};
