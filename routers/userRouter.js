import express from "express";
import userController from "../controllers/userController.js";
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

export default router;
