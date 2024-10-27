const db = require("../models/index");

const createRole = async ({ name }) => {
  return await db.Role.create({ name });
};
const getInfo = async ({ id }) => {
  return await db.Role.findOne({ where: { id } });
};

const getName = async ({ name }) => {
  return await db.Role.findOne({ where: { name } });
};

const updateRoleById = async (id, data) => {
  try {
    const role = await getInfo(id);
    if (!role) return false;

    await role.update(data);
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Cập nhật thông tin vai trò thất bại");
  }
};

const getAll = async ({ offset, limit }) => {
  const roles = await db.Role.findAndCountAll({
    offset,
    limit,
  });
  return roles;
};

module.exports = { createRole, getInfo, getName, getAll, updateRoleById };
