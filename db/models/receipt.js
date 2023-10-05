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

      // Award 1 point for every alphanumeric character in the retailer name
      return trimmedRetailerName.length;
    }

    _getPurchaseTotalPoints() {
      const { total } = this;
      let points = 0;

      // Award 50 points if the total is a round dollar amount with no cents
      const isRoundDollarAmount = total % 1 === 0;
      points += isRoundDollarAmount ? 50 : 0;

      // Award 25 points if the total is a multiple of .25
      const isMultipleOf25Cents = total % 0.25 === 0;
      points += isMultipleOf25Cents ? 25 : 0;

      return points;
    }

    async _getItemPoints() {
      const items = await this.getItems();
      let points = 0;

      // Award 5 points for every two items on the receipt
      const pointsPerEveryTwoItems = 5 * Math.floor(items.length / 2);
      points += pointsPerEveryTwoItems;

      items.forEach((item) => {
        // If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned for that item.
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

      // Award 6 points if the day in the purchase date is odd
      return day % 2 !== 0 ? 6 : 0;
    }

    _getPurchaseTimePoints() {
      const { purchaseTime } = this;
      const [hour, minute] = purchaseTime.split(":");
      const time = parseInt(hour + minute);

      // Award 10 points if the time of purchase is after 2:00pm and before 4:00pm
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
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
      purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
          isDate: true,
        },
      },
      purchaseTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
          isNumeric: true,
        },
      },
      points: {
        type: DataTypes.INTEGER,
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
