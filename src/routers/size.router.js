const { Router } = require("express");
const router = Router();

const sizeController = require("../controllers/size.controller");
const deserializeUser = require("../middleware/deserializeUser");
const restrictTo = require("../middleware/restrictTo");

router.post(
  "/create",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  sizeController.createHandler
);
router.put(
  "/update/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  sizeController.updateSizeByIdHandler
);
router.patch(
  "/change-status/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  sizeController.changeStatusSizeHandler
);
router.delete(
  "/delete/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  sizeController.deleteSizeByIdHandler
);
router.get(
  "/get/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  sizeController.getSizeByIdHandler
);
router.get(
  "/get-all",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  sizeController.getAllSizesHandler
);

router.get("/get", sizeController.getSizesHandler);

module.exports = router;
