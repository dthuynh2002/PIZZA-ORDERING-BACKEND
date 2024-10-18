const { Router } = require("express");
const router = Router();
const orderController = require("../controllers/order.controller");
const deserializeUser = require("../middleware/deserializeUser");

router.post("/create", deserializeUser, orderController.createOrderHandler);
router.delete(
  "/delete/:code",
  deserializeUser,
  orderController.deleteOrderHandler
);
router.get("/tracking", deserializeUser, orderController.getTrackingHandler);
router.patch(
  "/:id/change-status",
  deserializeUser,
  orderController.changeStatusOrderHandler
);
router.patch(
  "/change-payment-status/:orderCode",
  orderController.changePaymentStatsHandler
);
router.get("/get-all", deserializeUser, orderController.getAllOrdersHandler);

module.exports = router;
