const orderService = require("../services/order.service");
const ShortUniqueId = require("short-unique-id");
const { DELIVERY_METHOD_CODE, ORDER_STATUS_CODE } = require("../utils/order");
const {
  PAYMENT_STATUS_CODE,
  PAYMENT_METHOD_CODE,
} = require("../utils/payment");

const createOrderHandler = async (req, res) => {
  try {
    const {
      order_code,
      total_quantity,
      total_price,
      order_status,
      payment_status,
      payment_method,
      delivery_method,
      order_date,
      user_id,
    } = req.body;
    if (
      !total_quantity ||
      !total_price ||
      !order_status ||
      !payment_status ||
      !payment_method ||
      !delivery_method
    ) {
      return res.status(400).json({
        message: "Các trường là bắt buộc",
      });
    }
    const uidGenerator = new ShortUniqueId({ length: 6 });
    const orderCode = uidGenerator.randomUUID();
    const existedOrder = await orderService.findByOrderCode(orderCode);
    if (existedOrder) {
      return res.status(400).json({
        status: false,
        message: "Đã có lỗi xảy ra. Vui lòng thử lại.",
      });
    }

    const custom_oder = {
      total_quantity: total_quantity,
      total_price: total_price,
      order_status: ORDER_STATUS_CODE["PENDING"],
      payment_status: payment_status
        ? payment_status
        : PAYMENT_STATUS_CODE["UNPAID"],
      order_code: orderCode,
      user_id: req.user.id,
      delivery_method: delivery_method
        ? delivery_method
        : DELIVERY_METHOD_CODE["DELIVERY"],
      payment_method: payment_method
        ? payment_method
        : PAYMENT_METHOD_CODE["COD"],
    };
    const newOrder = await orderService.createOrder(custom_oder);
    if (!newOrder) {
      return res.status(500).json({
        status: false,
        message: "Có lỗi xảy ra khi tạo đơn hàng",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Tạo đơn hàng thành công",
      data: newOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Có lỗi xảy ra khi tạo đơn hàng",
    });
  }
};

module.exports = {
  createOrderHandler,
};
