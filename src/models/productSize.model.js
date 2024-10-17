"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductSize extends Model {
    static associate(models) {}
  }
  ProductSize.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      size_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProductSize",
      tableName: "ProductSizes",
    }
  );
  return ProductSize;
};
