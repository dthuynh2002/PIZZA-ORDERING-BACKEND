const { omit } = require("lodash");

const db = require("../models/index");
const { where } = require("sequelize");

const findCategoryByName = async (name) => {
  const category = await db.Category.findOne({
    where: { category_name: name },
  });
  return category;
};

const createCategory = async (data) => {
  const category = await db.Category.create(data);
  return omit(category.toJSON(), ["createdAt", "updatedAt"]);
};

const findCategoryById = async (id) => {
  const category = await db.Category.findOne({ where: { id } });
  return category;
};

const updateCategoryById = async (id, data) => {
  try {
    const category = await findCategoryById(id);
    if (!category) return null;
    await category.update(data);
    return category;
  } catch (e) {
    console.error("Error updating Categogy:", e);
    throw new Error("Failed to update category");
  }
};

const updateCategory = async (id, status) => {
  return await db.Category.update({ status }, { where: { id } });
};

const deleteCategoryById = async (id) => {
  return await db.Category.destroy({ where: { id } });
};

const findCategories = async ({ status, offset, limit }) => {
  const categories = await db.Category.findAndCountAll({
    where: status,
    offset,
    limit,
  });
  return categories;
};

module.exports = {
  findCategoryByName,
  createCategory,
  findCategoryById,
  updateCategoryById,
  updateCategory,
  deleteCategoryById,
  findCategories,
};
