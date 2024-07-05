import { body } from "express-validator";
import createValidator from "./helpers/createValidator.js";

const createEmailChain = () => {
  return body("email")
    .notEmpty()
    .withMessage("이메일을 입력해 주세요.")
    .bail()
    .isEmail()
    .withMessage("이메일 형식에 맞게 입력해 주세요.");
};

const createNicknameChain = () => {
  return body("nickname").notEmpty().withMessage("닉네임을 입력해 주세요.");
};

const createPasswordChain = () => {
  return body("password").notEmpty().withMessage("비밀번호를 입력해 주세요.");
};

const userValidator = {
  getSignupValidator() {
    return createValidator(
      createEmailChain,
      createNicknameChain,
      createPasswordChain
    );
  },

  getLoginValidator() {
    return createValidator(createEmailChain, createPasswordChain);
  },

  getCheckEmailValidator() {
    return createValidator(createEmailChain);
  },

  getCheckNicknameValidator() {
    return createValidator(createNicknameChain);
  },
};

export default userValidator;
