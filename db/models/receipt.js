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

    _getPurchaseTotalPoints() {
      const { total } = this;

      const isRoundDollarAmount = total % 1 === 0;
      const isMultipleOf25Cents = total % 0.25 === 0;

      let points = 0;
      points += isRoundDollarAmount ? 50 : 0;
      points += isMultipleOf25Cents ? 25 : 0;

      return points;
    }

    async _getItemPoints() {
      const items = await this.getItems();
      let points = 0;

      const pointsPerEveryTwoItems = 5 * Math.floor(items.length / 2);
      points += pointsPerEveryTwoItems;

      items.forEach((item) => {
        const trimmedDescription = item.shortDescription.trim();
        if (trimmedDescription.length % 3 === 0) {
          points += Math.ceil(0.2 * item.price);
        }
      });

      return points;
    }

    _getPurchaseDatePoints() {
      const { purchaseDate } = this;
      const date = new Date(purchaseDate);
      const day = date.getDay();
      return day % 2 !== 0 ? 6 : 0;
    }

    _getPurchaseTimePoints() {
      const { purchaseTime } = this;
      const time = new Date(purchaseTime);
      const hour = time.getUTCHours();
      return hour > 2 && hour < 4 ? 10 : 0;
    }

    async getPoints() {
      const retailerNamePoints = this._getRetailerNamePoints();
      const priceTotalPoints = this._getPurchaseTotalPoints();
      const itemPoints = await this._getItemPoints();
      const purchaseDatePoints = this._getPurchaseDatePoints();
      const purchaseTimePoints = this._getPurchaseTimePoints();

      let points = 0;
      points += retailerNamePoints;
      points += priceTotalPoints;
      points += itemPoints;
      points += purchaseDatePoints;
      points += purchaseTimePoints;

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
