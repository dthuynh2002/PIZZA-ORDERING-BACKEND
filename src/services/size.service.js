const { omit } = require("lodash");

const db = require("../models/index");

const findSizeByName = async (name) => {
  const size = await db.Size.findOne({
    where: { size_name: name },
  });
  return size;
};

const createSize = async (data) => {
  const size = await db.Size.create(data);
  return omit(size.toJSON(), ["createdAt", "updatedAt"]);
};

const findSizeById = async (id) => {
  const size = await db.Size.findOne({ where: { id } });
  return size;
};

const updateSizeById = async (id, data) => {
  try {
    const size = await findSizeById(id);
    if (!size) return null;
    await size.update(data);
    return size;
  } catch (e) {
    console.error("Error updating Size:", e);
    throw new Error("Failed to update size");
  }
};

const updateSize = async (id, status) => {
  return await db.Size.update({ status }, { where: { id } });
};

const deleteSizeById = async (id) => {
  return await db.Size.destroy({ where: { id } });
};

const findSizes = async ({ status, offset, limit }) => {
  const sizes = await db.Size.findAndCountAll({
    where: status,
    offset,
    limit,
  });
  return sizes;
};

module.exports = {
  findSizeByName,
  createSize,
  findSizeById,
  updateSizeById,
  updateSize,
  deleteSizeById,
  findSizes,
};
