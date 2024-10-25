"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Orders", "order_status", {
      type: Sequelize.ENUM(
        "Chờ xác nhận",
        "Đã xác nhận",
        "Đang chuẩn bị",
        "Đang giao hàng",
        "Đã giao hàng",
        "Đã hủy",
        "Đơn hàng không hợp lệ",
        "Đơn hàng thất bại"
      ),
      defaultValue: "Chờ xác nhận",
      allowNull: false,
    });

    await queryInterface.changeColumn("Orders", "payment_status", {
      type: Sequelize.ENUM("Chưa thanh toán", "Đã thanh toán"),
      defaultValue: "Chưa thanh toán",
    });

    await queryInterface.changeColumn("Orders", "payment_method", {
      type: Sequelize.ENUM("Thanh toán khi nhận hàng", "STRIPE"),
      defaultValue: "Thanh toán khi nhận hàng",
    });

    await queryInterface.changeColumn("Orders", "delivery_method", {
      type: Sequelize.ENUM("Giao hàng", "Mang về"),
      defaultValue: "Giao hàng",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Orders", "order_status", {
      type: Sequelize.ENUM(
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "SHIPPING",
        "DELIVERED",
        "CANCELED",
        "INVALID",
        "FAILED"
      ),
      defaultValue: "PENDING",
      allowNull: false,
    });

    await queryInterface.changeColumn("Orders", "payment_status", {
      type: Sequelize.ENUM("UNPAID", "PAID"),
      defaultValue: "UNPAID",
    });

    await queryInterface.changeColumn("Orders", "payment_method", {
      type: Sequelize.ENUM("COD", "PAYPAL"),
      defaultValue: "COD",
    });

    await queryInterface.changeColumn("Orders", "delivery_method", {
      type: Sequelize.ENUM("DELIVERY", "CARRYOUT"),
      defaultValue: "DELIVERY",
    });
  },
};
