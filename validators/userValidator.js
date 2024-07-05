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
const createSignupPasswordChain = () => {
  // 알파벳, 숫자, 특수문자가 1개씩 포함되는 8-20자 내의 값
  const alphabets = "A-Za-z";
  const numbers = "\\d";
  const specialChars = "@$!%*#?&";
  const regex = new RegExp(
    `^(?=.*[${alphabets}])(?=.*[${numbers}])(?=.*[${specialChars}])[${alphabets}${numbers}${specialChars}]{8,20}$`
  );

  return body("password")
    .notEmpty()
    .withMessage("비밀번호를 입력해 주세요.")
    .bail()
    .matches(regex)
    .withMessage("비밀번호를 형식에 맞게 입력해 주세요.");
};

const createLoginPasswordChain = () => {
  return body("password").notEmpty().withMessage("비밀번호를 입력해 주세요.");
};

const userValidator = {
  getSignupValidator() {
    return createValidator(
      createEmailChain,
      createNicknameChain,
      createSignupPasswordChain
    );
  },

  getLoginValidator() {
    return createValidator(createEmailChain, createLoginPasswordChain);
  },
};

export default userValidator;
