const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const userController = require("../controller/user_controller");
const profileImageUpload = require("../middleware/upload_user_profile_image");

router.post("/signup", profileImageUpload.upload, userController.signup);

router.post("/signin", userController.login);

router.get("/get-users", authMiddleware, userController.getUsers);

router.get("/get-user-by-id/:id", authMiddleware, userController.getUsersById);

router.put("/reset-password", userController.resetPassword);

router.post("/forgot-password", userController.forgotPassword);

router.post("/logout", authMiddleware, userController.logout);

router.put(
  "/update-user/:id",
  authMiddleware,
  profileImageUpload.upload,
  userController.updateUsers
);

router.delete("/remove-user/:id", authMiddleware, userController.deleteUsers);

module.exports = router;