const { Router } = require("express");
const router = Router();
const productController = require("../controllers/product.controller");

router.post("/create", productController.createProductHandler);
router.put("/update/:id", productController.updateProductByIdHandler);
router.patch("/change-status/:id", productController.changeStatusByIdHandler);
router.delete("/delete/:id", productController.deleteProductByIdHandler);
router.get("/get/:id", productController.getProductByIdHandler);
router.get("/get-all", productController.getAllProductsHandler);
router.get("/gets", productController.getProductsHandler);

module.exports = router;
