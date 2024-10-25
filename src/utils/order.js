const ORDER_STATUS_CODE = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PREPARING: "Đang chuẩn bị",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELED: "Đã hủy",
  INVALID: "Đơn hàng không hợp lệ",
  FAILED: "Đơn hàng thất bại",
};

const ORDER_STATUS_KEYS = Object.keys(ORDER_STATUS_CODE);

const DELIVERY_METHOD_CODE = {
  DELIVERY: "Giao hàng",
  CARRYOUT: "Mang về",
};

module.exports = {
  ORDER_STATUS_CODE,
  DELIVERY_METHOD_CODE,

  ORDER_STATUS_KEYS,
};
