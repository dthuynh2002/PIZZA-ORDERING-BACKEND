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

const getAll = async ({ offset, limit }) => {
  const roles = await db.Role.findAndCountAll({
    offset,
    limit,
  });
  return roles;
};

module.exports = { createRole, getInfo, getName, getAll };
