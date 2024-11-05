const { Router } = require("express");
const router = Router();
const orderController = require("../controllers/order.controller");

router.post("/paymentOrder", orderController.paymentHandler);
router.post("/paymentCallback", orderController.paymentCallbackHandler);
router.post(
  "/paymentStatus/:app_trans_id",
  orderController.checkPaymentStatusHandler
);

module.exports = router;
