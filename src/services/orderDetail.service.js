const db = require("../models/index");

const createOrderDetail = async (data) => {
  const orderDetail = await db.OrderDetail.create(data);
  return orderDetail;
};

const getOrders = async (orderId) => {
  const orders = await db.OrderDetail.findAndCountAll({
    where: { order_id: orderId },
  });
  return orders;
};

module.exports = {
  createOrderDetail,
  getOrders,
};
