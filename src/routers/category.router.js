const { Router } = require("express");
const router = Router();

const categoryController = require("../controllers/category.controller");
const deserializeUser = require("../middleware/deserializeUser");
const restrictTo = require("../middleware/restrictTo");

router.post(
  "/create",
  // [
  //   deserializeUser,
  //   restrictTo([
  //     "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
  //   ]),
  // ],
  categoryController.createHandler
);
router.put(
  "/update/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  categoryController.updateCategoryByIdHandler
);
router.patch(
  "/change-status/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  categoryController.changeStatusCategoryHandler
);
router.delete(
  "/delete/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  categoryController.deleteCategoryByIdHandler
);
router.get(
  "/get/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  categoryController.getCategoryByIdHandler
);
router.get(
  "/get-all",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  categoryController.getAllCategoriesHandler
);

router.get("/get", categoryController.getCategoriesHandler);

module.exports = router;
