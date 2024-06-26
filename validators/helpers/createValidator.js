import validationErrorChecker from "../middlewares/validationErrorChecker.js";

const createValidator = (...chainCreators) => {
  return [
    ...chainCreators.map((chainCreator) => chainCreator()),
    validationErrorChecker,
  ];
};

export default createValidator;
