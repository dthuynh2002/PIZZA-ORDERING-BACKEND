const db = require("../models/index");

const createOrder = async (data) => {
  const order = db.Order.create(data);
  return order;
};

const findByOrderCode = async (oderCode) => {
  const order = await db.Order.findOne({ where: { order_code: oderCode } });
  return order;
};

module.exports = {
  createOrder,
  findByOrderCode,
};
