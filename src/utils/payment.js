const PAYMENT_METHOD_CODE = {
  COD: "Thanh toán khi nhận hàng",
  STRIPE: "STRIPE",
};

const PAYMENT_METHOD_KEYS = Object.keys(PAYMENT_METHOD_CODE);

const PAYMENT_STATUS_CODE = {
  PAID: "Đã thanh toán",
  UNPAID: "Chưa thanh toán",
};

const PAYMENT_STATUS_KEYS = Object.keys(PAYMENT_STATUS_CODE);

module.exports = {
  PAYMENT_METHOD_CODE,
  PAYMENT_STATUS_CODE,

  PAYMENT_METHOD_KEYS,
  PAYMENT_STATUS_KEYS,
};
