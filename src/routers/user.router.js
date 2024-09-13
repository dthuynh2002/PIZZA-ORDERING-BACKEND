const { Router } = require("express");
const router = Router();
const userController = require("../controllers/user.controller");
const deserializeUser = require("../middleware/deserializeUser");
const restrictTo = require("../middleware/restrictTo");
const upload = require("../middleware/uploadImage");

router.post("/create", userController.createUserHandler);
router.post("/login", userController.loginHandler);
router.put(
  "/update",
  deserializeUser,
  upload.single("avatar"),
  userController.updateHandler
);

router.get("/profile", deserializeUser, userController.getProfileHandler);
router.patch(
  "/change-password",
  deserializeUser,
  userController.changePasswordHandler
);
router.post(
  "/refresh-token",
  deserializeUser,
  userController.refreshTokenHandler
);
router.post(
  "/create-staff",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  userController.createStaffHandler
);

router.patch(
  "/update-status/:id",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  userController.updateStatusHandler
);
router.get(
  "/all",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
      "945a8db9-dc54-4442-9f98-49c6c380f130", // STAFF
    ]),
  ],
  userController.getAllUsersHandler
);

router.get(
  "/all-staff",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  userController.getAllStaffsHandler
);
router.get(
  "/all-admin",
  [
    deserializeUser,
    restrictTo([
      "449cbc4f-1901-4724-8881-c5fc3b6253e1", // ADMIN
    ]),
  ],
  userController.getAllAdminsHandler
);

module.exports = router;
