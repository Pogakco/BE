import { body } from "express-validator";
import createValidator from "./helpers/createValidator.js";
import imageFileChain from "./helpers/imageFileChain.js";

const getPasswordRegex = () => {
  // 알파벳, 숫자, 특수문자가 1개씩 포함되는 8-20자 내의 값
  const alphabets = "A-Za-z";
  const numbers = "\\d";
  const specialChars = "@$!%*#?&";

  return new RegExp(
    `^(?=.*[${alphabets}])(?=.*[${numbers}])(?=.*[${specialChars}])[${alphabets}${numbers}${specialChars}]{8,20}$`
  );
};

const createProviderChain = () => {
  return body("provider")
    .notEmpty()
    .withMessage("provider를 입력해 주세요.")
    .bail()
    .isIn(["GOOGLE", "KAKAO"])
    .withMessage("잘못된 provider 입니다.");
};

const createEmailChain = () => {
  return body("email")
    .notEmpty()
    .withMessage("이메일을 입력해 주세요.")
    .bail()
    .isEmail()
    .withMessage("이메일 형식에 맞게 입력해 주세요.");
};

const createNicknameChain = () => {
  // 1. 문자열의 시작부터 연속된 두 개 이상의 공백이 불가능하고, 앞뒤에 공백이 올 수 없음
  // 2. 숫자, 영어, 완성형 한글(가-힣)만 포함될 수 있음
  // 3. 2-10자 내의 값
  const validChars = "0-9a-zA-Z가-힣";
  const regex = new RegExp(
    `^(?!.*\\s{2,})[${validChars}][${validChars}\\s]{0,8}[${validChars}]$`
  );

  return body("nickname")
    .notEmpty()
    .withMessage("닉네임을 입력해 주세요.")
    .bail()
    .matches(regex)
    .withMessage("닉네임을 형식에 맞게 입력해 주세요.");
};

const createSignupPasswordChain = () => {
  return body("password")
    .notEmpty()
    .withMessage("비밀번호를 입력해 주세요.")
    .bail()
    .matches(getPasswordRegex())
    .withMessage("비밀번호를 형식에 맞게 입력해 주세요.");
};

const createLoginPasswordChain = () => {
  return body("password").notEmpty().withMessage("비밀번호를 입력해 주세요.");
};

const createUpdateProfilePasswordChain = () => {
  return body("password")
    .optional()
    .matches(getPasswordRegex())
    .withMessage("비밀번호를 형식에 맞게 입력해 주세요.");
};

const createProfileImageChain = () => {
  return imageFileChain("profileImage", { optional: true });
};

const userValidator = {
  getSocialAuthValidator() {
    return createValidator(createProviderChain);
  },

  getSignupValidator() {
    return createValidator(
      createEmailChain,
      createNicknameChain,
      createSignupPasswordChain
    );
  },

  getSocialSignupValidator() {
    return createValidator(
      createEmailChain,
      createNicknameChain,
      createProviderChain
    );
  },

  getLoginValidator() {
    return createValidator(createEmailChain, createLoginPasswordChain);
  },

  getCheckEmailValidator() {
    return createValidator(createEmailChain);
  },

  getCheckNicknameValidator() {
    return createValidator(createNicknameChain);
  },

  getUpdateMyProfileValidator() {
    return createValidator(
      createUpdateProfilePasswordChain,
      createNicknameChain,
      createProfileImageChain
    );
  },

  getCheckPasswordValidator() {
    return createValidator(createLoginPasswordChain);
  },
};

export default userValidator;
