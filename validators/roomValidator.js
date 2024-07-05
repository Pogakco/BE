import { query } from "express-validator";
import createValidator from "./helpers/createValidator.js";

const createIsRunningChain = () => {
  return query("is_running")
    .optional()
    .isBoolean()
    .withMessage("boolean 형식입니다.");
};

const createPageChain = () => {
  return query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page는 1 이상의 정수입니다.");
};

const createLimitChain = () => {
  return query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit는 1 이상의 정수입니다.");
};

const roomValidator = {
  getAllRoomsValidator() {
    return createValidator(
      createIsRunningChain,
      createPageChain,
      createLimitChain
    );
  },
};

export default roomValidator;
