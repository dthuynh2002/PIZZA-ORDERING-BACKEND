"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate(models) {
      Size.belongsToMany(models.Product, {
        through: models.ProductSize,
        foreignKey: "size_id",
        as: "sizes",
      });

      Size.hasMany(models.OrderDetail, {
        foreignKey: "size_id",
        as: "sizeOrder",
      });
    }
  }
  Size.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      size_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
      modelName: "Size",
      tableName: "Sizes",
    }
  );
  return Size;
};
