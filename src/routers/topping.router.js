const { Router } = require("express");
const router = Router();

const toppingController = require("../controllers/topping.controller");
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
  toppingController.createHandler
);
router.put(
  "/update/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  toppingController.updateToppingByIdHandler
);

router.patch(
  "/change-status/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  toppingController.changeStatusToppingHandler
);

router.delete(
  "/delete/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  toppingController.deleteToppingByIdHandler
);

router.get(
  "/get/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  toppingController.getToppingByIdHandler
);

router.get(
  "/get-all",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  toppingController.getAllToppingsHandler
);

router.get("/get", toppingController.getToppingsHandler);
module.exports = router;
