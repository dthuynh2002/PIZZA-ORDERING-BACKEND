const { Router } = require("express");
const router = Router();
const productController = require("../controllers/product.controller");

router.post("/create", productController.createProductHandler);

module.exports = router;
