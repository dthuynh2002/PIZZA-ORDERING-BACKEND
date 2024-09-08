"use strict";
const { ROLE_CODE } = require("../utils/role");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable("Roles", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.ENUM,
        values: Object.values(ROLE_CODE),
        defaultValue: ROLE_CODE.USER,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable("Roles");
  },
};
