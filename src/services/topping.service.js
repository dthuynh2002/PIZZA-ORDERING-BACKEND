const { omit } = require("lodash");

const db = require("../models/index");
const { where } = require("sequelize");

const findToppingByName = async (name) => {
  const topping = await db.Topping.findOne({
    where: { topping_name: name },
  });
  return topping;
};

const createTopping = async (data) => {
  const topping = await db.Topping.create(data);
  return omit(topping.toJSON(), ["createdAt", "updatedAt"]);
};

const findToppingById = async (id) => {
  const topping = await db.Topping.findOne({ where: { id } });
  return topping;
};

const updateToppingById = async (id, data) => {
  try {
    const topping = await findToppingById(id);
    if (!topping) return null;
    await topping.update(data);
    return topping;
  } catch (e) {
    console.error("Error updating Topping:", e);
    throw new Error("Failed to update topping");
  }
};

const updateTopping = async (id, status) => {
  return await db.Topping.update({ status }, { where: { id } });
};

const deleteToppingById = async (id) => {
  return await db.Topping.destroy({ where: { id } });
};

const findToppings = async ({ status, offset, limit }) => {
  const toppings = await db.Topping.findAndCountAll({
    where: status,
    offset,
    limit,
  });
  return toppings;
};

module.exports = {
  findToppingByName,
  createTopping,
  findToppingById,
  updateToppingById,
  updateTopping,
  deleteToppingById,
  findToppings,
};
