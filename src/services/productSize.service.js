const { omit } = require("lodash");

const db = require("../models/index");

const createProductSize = async (data) => {
  console.log("check data: ", data);
  const productSize = await db.ProductSize.create(data);
  return omit(productSize.toJSON(), ["createdAt", "updatedAt"]);
};

const findProductSizeById = async (id) => {
  const productSize = await db.ProductSize.findByPk(id);
  return productSize;
};

const updateProductSizeById = async (id, data) => {
  try {
    const productSize = await findProductSizeById(id);
    if (!productSize) {
      return null;
    }
    await productSize.update(data);
    return productSize;
  } catch (error) {
    throw error;
  }
};

const deleteProductSizeById = async (id) => {
  return await db.ProductSize.destroy({ where: { id } });
};

const getAllProductSizes = async (productId) => {
  const productSizes = await db.ProductSize.findAll({
    where: { product_id: productId },
  });
  return productSizes;
};

module.exports = {
  createProductSize,
  findProductSizeById,
  updateProductSizeById,
  deleteProductSizeById,
  getAllProductSizes,
};
