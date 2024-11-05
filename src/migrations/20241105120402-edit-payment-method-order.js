"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Orders", "payment_method", {
      type: Sequelize.ENUM("Thanh toán khi nhận hàng", "ZALOPAY"),
      defaultValue: "Thanh toán khi nhận hàng",
    });
  },
};
