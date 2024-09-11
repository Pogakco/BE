import express from "express";
import multerErrorHandler from "../controllers/helpers/multerErrorHandler.js";
import userController from "../controllers/userController.js";
import loginRequired from "../middlewares/loginRequired.js";
import multerUpload from "../middlewares/multerUpload.js";
import userValidator from "../validators/userValidator.js";

const router = express.Router();
router.use(express.json());

router.post(
  "/auth",
  [loginRequired({ skipAuthError: true })],
  userController.auth
);

router.post(
  "/social-auth",
  [...userValidator.getSocialAuthValidator()],
  userController.socialAuth
);

router.post(
  "/signup",
  [...userValidator.getSignupValidator()],
  userController.signup
);

router.post(
  "/social-signup",
  [...userValidator.getSocialSignupValidator()],
  userController.socialSignup
);

router.post(
  "/login",
  [...userValidator.getLoginValidator()],
  userController.login
);

router.post("/logout", [loginRequired()], userController.logout);

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

router.get("/users/me", [loginRequired()], userController.myProfile);

router.post(
  "/users/me",
  [
    loginRequired(),
    multerErrorHandler(multerUpload.single("profileImage")),
    ...userValidator.getUpdateMyProfileValidator(),
  ],
  userController.updateMyProfile
);

router.post(
  "/users/me/confirm-password",
  [loginRequired(), ...userValidator.getCheckPasswordValidator()],
  userController.confirmPassword
);

export default router;
