"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("OrderDetails", "size_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "Sizes",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("OrderDetails", "size_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "Sizes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
};
