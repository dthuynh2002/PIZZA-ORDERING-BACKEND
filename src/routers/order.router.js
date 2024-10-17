const { Router } = require("express");
const router = Router();
const orderController = require("../controllers/order.controller");
const deserializeUser = require("../middleware/deserializeUser");

router.post("/create", deserializeUser, orderController.createOrderHandler);

module.exports = router;
