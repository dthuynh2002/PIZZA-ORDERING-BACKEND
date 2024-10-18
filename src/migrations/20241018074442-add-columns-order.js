"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Orders", "email", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Orders", "phone", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Orders", "notes", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
