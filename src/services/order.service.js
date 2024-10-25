const db = require("../models/index");

const createOrder = async (data) => {
  const order = db.Order.create(data);
  return order;
};

const findByOrderCode = async (oderCode) => {
  const order = await db.Order.findOne({ where: { order_code: oderCode } });
  return order;
};

const deleteOrder = async (code) => {
  const deletedOrder = await db.Order.destroy({ where: code });
  return deletedOrder;
};
const findAllByOrderCode = async (code) => {
  const order = await db.Order.findAll({ where: { order_code: code } });
  return order;
};

const findByPhoneNumber = async (code) => {
  const order = await db.Order.findAll({
    where: { phone: code },
  });
  return order;
};
const updateOrderById = async (id, data) => {
  const order = await db.Order.update(data, { where: { id } });
  return order;
};

const updateOrderByCode = async (code, data) => {
  const order = await db.Order.update(data, { where: code });
  return order;
};

const findOrders = async (id, { offset, limit }) => {
  const orders = await db.Order.findAndCountAll({
    where: { user_id: id },
    offset,
    limit,
    include: [
      {
        model: db.OrderDetail,
        as: "orderDetails",
        attributes: [
          "id",
          "quantity",
          "price",
          "total_price",
          "product_id",
          "size_id",
        ],
      },
    ],
  });
  return orders;
};

const findOrderById = async (id) => {
  const order = await db.Order.findByPk(id);
  return order;
};

module.exports = {
  createOrder,
  findByOrderCode,
  deleteOrder,
  findAllByOrderCode,
  findByPhoneNumber,
  updateOrderById,
  updateOrderByCode,
  findOrders,
  findOrderById,
};
