"use strict";

const { Model } = require("sequelize");
const { ROLE_CODE } = require("../utils/role");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, {
        foreignKey: "role_id",
        as: "users",
      });
    }
  }
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.ENUM,
        values: Object.values(ROLE_CODE),
        defaultValue: ROLE_CODE.USER,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "Roles",
    }
  );
  return Role;
};
