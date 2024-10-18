const { Router } = require("express");
const router = Router();
const orderDetailController = require("../controllers/orderDetail.controller");

router.post("/create", orderDetailController.createOrderDetailHandler);
router.get("/get-all", orderDetailController.getAllOrderDetailHandler);

module.exports = router;
