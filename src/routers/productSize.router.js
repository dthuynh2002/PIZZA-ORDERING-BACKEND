const { Router } = require("express");
const router = Router();
const productSizeController = require("../controllers/productSize.controller");

router.post("/create", productSizeController.createProductSizeHandler);
router.put("/update/:id", productSizeController.updateProductSizeByIdHandler);
router.delete("/delete/:id", productSizeController.deleteProductSizeHandler); // delete
router.get("/get/:id", productSizeController.getProductSizeHandler); // get
router.get("/getAll", productSizeController.getProductSizeAllHandler);

module.exports = router;
