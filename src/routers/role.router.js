const { Router } = require("express");
const router = Router();
const roleController = require("../controllers/role.controller");
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
  roleController.createRoleHandler
);
router.get("/info/:id", roleController.getInfoHandler);
router.get("/name/:name", roleController.getNameHandler);
router.put("update/:id", roleController.updateRoleByIdHandler);
router.get("/all", roleController.getAll);

module.exports = router;
