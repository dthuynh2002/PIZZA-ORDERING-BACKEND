const { omit } = require("lodash");

const db = require("../models/index");

const createProduct = async (data) => {
  const product = await db.Product.create(data);
  return omit(product.toJSON(), ["createdAt", "updatedAt"]);
};
const findProductById = async (id) => {
  const product = await db.Product.findOne({ where: { id } });
  return product;
};
const findProductByName = async (name) => {
  const product = await db.Product.findOne({ where: { name_product: name } });
  return product;
};

const updateProduct = async (id, data) => {
  try {
    const product = await findProductById(id);
    if (!product) return null;
    await product.update(data);
    return omit(product?.toJSON(), ["createdAt", "updatedAt"]);
  } catch (e) {
    console.error("Cập nhật thông tin sản phẩm thất bại", e);
    throw new Error("Cập nhật thông tin sản phẩm thất bại");
  }
};

const changeStatus = async (id, status) => {
  return await db.Product.update({ status: status }, { where: { id } });
};

const deleteProductById = async (id) => {
  return await db.Product.destroy({ where: { id } });
};

const getAllProducts = async ({ active, offset, limit }) => {
  const products = await db.Product.findAndCountAll({
    where: active,
    offset,
    limit,
  });
  return products;
};

module.exports = {
  createProduct,
  findProductById,
  findProductByName,
  updateProduct,
  changeStatus,
  deleteProductById,
  getAllProducts,
};
