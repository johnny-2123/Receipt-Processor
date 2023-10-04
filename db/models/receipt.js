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
      const day = date.getUTCDate();

      return day % 2 !== 0 ? 6 : 0;
    }

    _getPurchaseTimePoints() {
      const { purchaseTime, purchaseDate } = this;
      const [hour, minute] = purchaseTime.split(":");
      const time = parseInt(hour + minute);

      return time > 1400 && time < 1600 ? 10 : 0;
    }

    async calculateAndSetPoints() {
      const retailerNamePoints = this._getRetailerNamePoints();
      const purchaseTotalPoints = this._getPurchaseTotalPoints();
      const itemPoints = await this._getItemPoints();
      const purchaseDatePoints = this._getPurchaseDatePoints();
      const purchaseTimePoints = this._getPurchaseTimePoints();

      let points = 0;
      points += retailerNamePoints;
      points += purchaseTotalPoints;
      points += itemPoints;
      points += purchaseDatePoints;
      points += purchaseTimePoints;

      this.points = points;
      await this.save();

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
      points: {
        type: DataTypes,
        defaultValue: 0,
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
            "points",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      scopes: {
        points: {
          attributes: {
            exclude: [
              "id",
              "retailer",
              "purchaseDate",
              "purchaseTime",
              "total",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      },
    }
  );

  return Receipt;
};
