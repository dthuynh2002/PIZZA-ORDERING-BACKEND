const orderService = require("../services/order.service");
const ShortUniqueId = require("short-unique-id");
const {
  DELIVERY_METHOD_CODE,
  ORDER_STATUS_CODE,
  ORDER_STATUS_KEYS,
} = require("../utils/order");
const {
  PAYMENT_STATUS_CODE,
  PAYMENT_METHOD_CODE,
  PAYMENT_STATUS_KEYS,
} = require("../utils/payment");
const {
  PHONE_NUMBER_VALIDATION,
  ORDER_CODE_VALIDATION,
  EMAIL_VALIDATION,
} = require("../utils/valications");

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
      name,
      email,
      phone,
    } = req.body;
    if (
      !total_quantity ||
      !total_price ||
      !order_status ||
      !payment_status ||
      !payment_method ||
      !delivery_method ||
      !name ||
      !email ||
      !phone
    ) {
      return res.status(400).json({
        message: "Các trường là bắt buộc",
      });
    }
    if (!email.match(EMAIL_VALIDATION)) {
      return res.status(400).json({
        status: false,
        message: "Email không hợp lệ",
      });
    }
    if (!phone.match(PHONE_NUMBER_VALIDATION)) {
      return res.status(400).json({
        status: false,
        message: "Số điện thoại không hợp lệ",
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
      name: name,
      email: email,
      phone: phone,
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

const deleteOrderHandler = async (req, res) => {
  const { code } = req.params;
  if (!code) {
    return res.status(400).json({
      status: false,
      message: "Mã đơn hàng là bắt buộc",
    });
  }
  try {
    await orderService.deleteOrder({ order_code: code });
    return res.status(200).json({
      status: true,
      message: "Xóa đơn hàng thành công",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Có lỗi xảy ra khi xóa đơn hàng",
    });
  }
};

const getTrackingHandler = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({
      status: false,
      message: "Mã đơn hàng là bắt buộc",
    });
  }
  let order;
  if (code.match(ORDER_CODE_VALIDATION)) {
    order = await orderService.findAllByOrderCode(code);
  } else if (code.match(PHONE_NUMBER_VALIDATION)) {
    order = await orderService.findByPhoneNumber(code);
  } else {
    return res.status(400).json({
      status: true,
      message: "Order không tồn tại",
      data: [],
    });
  }
  return res.status(200).json({
    status: true,
    message: "Lấy thông tin đơn hàng thành công",
    data: order,
  });
};

const changeStatusOrderHandler = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.query;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id đơn hàng là bắt buộc",
    });
  }
  if (!ORDER_STATUS_KEYS.includes(status.toUpperCase())) {
    return res.status(400).json({
      status: false,
      message: "Trạng thái đơn hàng không hợp lệ",
    });
  }
  let order;
  if (status.toUpperCase() === ORDER_STATUS_CODE["DELIVERED"]) {
    order = await orderService.updateOrderById(id, {
      order_status: ORDER_STATUS_CODE["DELIVERED"],
      payment_status: PAYMENT_STATUS_CODE["PAID"],
      notes: notes,
    });
  } else {
    order = await orderService.updateOrderById(id, {
      order_status: status.toUpperCase(),
      notes: notes,
    });
  }
  if (!order) {
    return res.status(404).json({
      status: false,
      message: "Đơn hàng không tồn tại",
    });
  }
  return res.status(200).json({
    status: true,
    message: `Trạng thái đơn hàng đã được ${status}`,
    data: order,
  });
};

const changePaymentStatsHandler = async (req, res) => {
  const { orderCode } = req.params;
  const { status } = req.query;
  if (!orderCode) {
    return res.status(400).json({
      status: false,
      message: "Mã đơn hàng là bắt buộc",
    });
  }

  if (!PAYMENT_STATUS_KEYS.includes(status.toUpperCase())) {
    return res.status(400).json({
      status: false,
      message: "Trạng thái đơn hàng không hợp lệ",
    });
  }

  const order = await orderService.updateOrderByCode(
    { order_code: orderCode },
    {
      payment_status: status.toUpperCase(),
    }
  );
  if (!order) {
    return res.status(404).json({
      status: false,
      message: "Đơn hàng không tồn tại",
    });
  }
  return res.status(200).json({
    status: true,
    message: `Trạng thái đơn hàng đã được ${status}`,
    data: order,
  });
};

// Lấy tất cả order của một User
const getAllOrdersHandler = async (req, res) => {
  const { id } = req.user;
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  let orders = [];
  orders = await orderService.findOrders(id, {
    offset,
    limit: parseInt(limit),
  });
  return res.status(200).json({
    status: true,
    message: "Lấy thông tin đơn hàng thành công",
    data: orders.rows,
    total: orders.count,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

module.exports = {
  createOrderHandler,
  deleteOrderHandler,
  getTrackingHandler,
  changeStatusOrderHandler,
  changePaymentStatsHandler,
  getAllOrdersHandler,
};
