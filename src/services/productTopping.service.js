const { omit } = require("lodash");

const db = require("../models/index");

const createProductTopping = async (data) => {
  const productTopping = await db.ProductTopping.create(data);
  return omit(productTopping.toJSON(), ["createdAt", "updatedAt"]);
};

const findProductToppingById = async (id) => {
  const productTopping = await db.ProductTopping.findByPk(id);
  return productTopping;
};

const updateProductToppingById = async (id, data) => {
  try {
    const productTopping = await findProductToppingById(id);
    if (!productTopping) {
      return null;
    }
    await productTopping.update(data);
    return productTopping;
  } catch (error) {
    throw error;
  }
};

const deleteProductToppingById = async (id) => {
  return await db.ProductTopping.destroy({ where: { id } });
};

const getAllProductToppings = async (productId) => {
  const productToppings = await db.ProductTopping.findAll({
    where: { product_id: productId },
  });
  return productToppings;
};

module.exports = {
  createProductTopping,
  findProductToppingById,
  updateProductToppingById,
  deleteProductToppingById,
  getAllProductToppings,
};
