const { Router } = require("express");
const router = Router();
const productToppingController = require("../controllers/productTopping.controller");

router.post("/create", productToppingController.createProductToppingHandler);
router.put("/update/:id", productToppingController.updateProductToppingHandler);
router.delete(
  "/delete/:id",
  productToppingController.deleteProductToppingHandler
);
router.get("/get/:id", productToppingController.getProductToppingHandler);
router.get("/get-all", productToppingController.getAllProductToppingHandler);

module.exports = router;
