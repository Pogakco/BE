import { StatusCodes } from "http-status-codes";
import { MulterError } from "multer";

const multerErrorHandler = (multerUpload) => {
  return (req, res, next) => {
    multerUpload(req, res, (error) => {
      if (!error) {
        return next();
      }

      console.log(error);

      const isMulterLimitFileSizeError =
        error instanceof MulterError && error.code === "LIMIT_FILE_SIZE";

      if (isMulterLimitFileSizeError) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "파일 크기는 5MB 미만이어야 합니다." });
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "서버 오류가 발생했습니다." });
    });
  };
};

export default multerErrorHandler;
