import { body } from "express-validator";
import createValidator from "./helpers/createValidator.js";

const createFeedbackChain = () => {
  return body("contents")
    .notEmpty()
    .withMessage("내용을 입력해주세요.")
    .bail()
    .isLength({ max: 500 })
    .withMessage("피드백 내용은 500자 이내여야 합니다.");
};

const feedbackValidator = {
  getFeedbackValidator() {
    return createValidator(createFeedbackChain);
  },
};

export default feedbackValidator;
