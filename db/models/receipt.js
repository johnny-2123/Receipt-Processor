const { Model, DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize, models) => {
  class Receipt extends Model {
    static associate(models) {
      Receipt.hasMany(models.Item, {
        foreignKey: "receiptId",
        onDelete: "CASCADE",
      });
    }

    _getRetailerNamePoints() {
      const { retailer } = this;
      const trimmedRetailerName = retailer.replace(/[^a-zA-Z0-9]/g, "");
      return trimmedRetailerName.length;
    }

    _getPriceTotalPoints() {
      const { total } = this;

      const isRoundDollarAmount = total % 1 === 0;
      const isMultipleOf25Cents = total % 0.25 === 0;

      let points = 0;
      points += isRoundDollarAmount ? 50 : 0;
      points += isMultipleOf25Cents ? 25 : 0;

      return points;
    }

    async getPoints() {
      const retailerNamePoints = this._getRetailerNamePoints();
      const priceTotalPoints = this._getPriceTotalPoints();

      let points = 0;
      points += retailerNamePoints;
      points += priceTotalPoints;

      return points;
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
      scopes: {
        points: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
    }
  );

  return Receipt;
};
