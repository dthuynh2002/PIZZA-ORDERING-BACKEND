const { Router } = require("express");
const router = Router();
const userController = require("../controllers/user.controller");

router.post("/create", userController.createUserHandler);

module.exports = router;
