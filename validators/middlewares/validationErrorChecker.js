import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

const validationErrorChecker = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ error: errors.array()[0].msg });
};

export default validationErrorChecker;
