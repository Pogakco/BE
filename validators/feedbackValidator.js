import { body } from "express-validator";
import createValidator from "./helpers/createValidator.js";

const createFeedbackChain = () => {
  return body("contents").notEmpty().withMessage("내용을 입력해주세요.");
};

const feedbackValidator = {
  getFeedbackValidator() {
    return createValidator(createFeedbackChain);
  },
};

export default feedbackValidator;
