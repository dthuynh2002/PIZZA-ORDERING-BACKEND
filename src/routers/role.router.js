const { Router } = require("express");
const router = Router();
const roleController = require("../controllers/role.controller");

router.post("/create", roleController.createRoleHandler);
router.get("/info/:id", roleController.getInfoHandler);
router.get("/name/:name", roleController.getNameHandler);
router.get("/all", roleController.getAll);

module.exports = router;
