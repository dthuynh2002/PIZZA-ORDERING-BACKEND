"use strict";

const { Model } = require("sequelize");

const {
  DELIVERY_METHOD_CODE,
  ORDER_STATUS_CODE,
  ORDER_STATUS_KEYS,
} = require("../utils/order");
const {
  PAYMENT_STATUS_CODE,
  PAYMENT_METHOD_CODE,
  PAYMENT_METHOD_KEYS,
} = require("../utils/payment");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // An order belongs to a user
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // An order has many order details
      Order.hasMany(models.OrderDetail, {
        foreignKey: "order_id",
        as: "orderDetails",
      });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      order_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true,
      },
      total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      order_status: {
        type: DataTypes.ENUM(...ORDER_STATUS_KEYS),
        defaultValue: ORDER_STATUS_CODE["PENDING"],
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.ENUM(
          PAYMENT_STATUS_CODE["UNPAID"],
          PAYMENT_STATUS_CODE["PAID"]
        ),
        defaultValue: PAYMENT_STATUS_CODE["UNPAID"],
      },
      payment_method: {
        type: DataTypes.ENUM(...PAYMENT_METHOD_KEYS),
        defaultValue: PAYMENT_METHOD_CODE["COD"],
      },
      delivery_method: {
        type: DataTypes.ENUM(
          DELIVERY_METHOD_CODE["DELIVERY"],
          DELIVERY_METHOD_CODE["CARRYOUT"]
        ),
        defaultValue: DELIVERY_METHOD_CODE["DELIVERY"],
      },
      order_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
    }
  );
  return Order;
};
