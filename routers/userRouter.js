import express from "express";
import multerErrorHandler from "../controllers/helpers/multerErrorHandler.js";
import userController from "../controllers/userController.js";
import multerUpload from "../middlewares/multerUpload.js";
import loginRequired from "../validators/middlewares/loginRequired.js";
import userValidator from "../validators/userValidator.js";

const router = express.Router();
router.use(express.json());

router.post("/auth", userController.auth);

router.post(
  "/signup",
  [...userValidator.getSignupValidator()],
  userController.signup
);

router.post(
  "/login",
  [...userValidator.getLoginValidator()],
  userController.login
);

router.post("/logout", [loginRequired], userController.logout);

router.post(
  "/check-email",
  [...userValidator.getCheckEmailValidator()],
  userController.checkEmail
);

router.post(
  "/check-nickname",
  [...userValidator.getCheckNicknameValidator()],
  userController.checkNickname
);

router.get("/users/me", [loginRequired], userController.myProfile);

router.post(
  "/users/me",
  [
    loginRequired,
    multerErrorHandler(multerUpload.single("profileImage")),
    ...userValidator.getUpdateMyProfileValidator(),
  ],
  userController.updateMyProfile
);

export default router;
