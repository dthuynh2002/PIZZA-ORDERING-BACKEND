"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      // An order detail belongs to an order
      OrderDetail.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });

      // An order detail belongs to a motorcycle parts
      OrderDetail.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });

      OrderDetail.belongsTo(models.Size, {
        foreignKey: "size_id",
        as: "size",
      });
    }
  }

  OrderDetail.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      size_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderDetail",
      tableName: "OrderDetails",
    }
  );

  return OrderDetail;
};
