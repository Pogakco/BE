import { StatusCodes } from "http-status-codes";

const defaultErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "서버 오류가 발생했습니다." });
};

export default defaultErrorHandler;
