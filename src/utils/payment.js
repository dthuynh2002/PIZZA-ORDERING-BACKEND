const PAYMENT_METHOD_CODE = {
  COD: "COD", // Cash on delivery
  STRIPE: "STRIPE",
  VIETQR: "VIETQR",
};

const PAYMENT_METHOD_KEYS = Object.keys(PAYMENT_METHOD_CODE);

const PAYMENT_STATUS_CODE = {
  PAID: "PAID", // Đã thanh toán
  UNPAID: "UNPAID", // Chưa thanh toán
};

const PAYMENT_STATUS_KEYS = Object.keys(PAYMENT_STATUS_CODE);

module.exports = {
  PAYMENT_METHOD_CODE,
  PAYMENT_STATUS_CODE,

  PAYMENT_METHOD_KEYS,
  PAYMENT_STATUS_KEYS,
};
