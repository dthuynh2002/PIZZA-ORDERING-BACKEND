"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Topping extends Model {
    static associate(models) {
      Topping.belongsToMany(models.Product, {
        through: models.ProductTopping,
        foreignKey: "topping_id",
        as: "toppings",
      });
    }
  }
  Topping.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      topping_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Topping",
      tableName: "Toppings",
    }
  );
  return Topping;
};
