const { Router } = require("express");
const router = Router();
const productController = require("../controllers/product.controller");
const deserializeUser = require("../middleware/deserializeUser");
const restrictTo = require("../middleware/restrictTo");
const upload = require("../middleware/uploadImage");

router.post(
  "/create",
  upload.single("image"),
  productController.createProductHandler
);
router.put(
  "/update/:id",
  upload.single("image"),
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
      "945a8db9-dc54-4442-9f98-49c6c380f130", // STAFF
    ]),
  ],
  productController.updateProductByIdHandler
);
router.patch(
  "/change-status/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
      "945a8db9-dc54-4442-9f98-49c6c380f130", // STAFF
    ]),
  ],
  productController.changeStatusByIdHandler
);
router.delete(
  "/delete/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
      "945a8db9-dc54-4442-9f98-49c6c380f130", // STAFF
    ]),
  ],
  productController.deleteProductByIdHandler
);
router.get(
  "/get/:id",
  deserializeUser,
  productController.getProductByIdHandler
);
router.get(
  "/get-all",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
      "945a8db9-dc54-4442-9f98-49c6c380f130", // STAFF
    ]),
  ],
  productController.getAllProductsHandler
);
router.get("/gets", productController.getProductsHandler);

module.exports = router;
