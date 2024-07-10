import { check } from "express-validator";
import { extname } from "path";

const defaultOptions = {
  optional: false,
};

const imageFileChain = (fields, options = defaultOptions) => {
  const { optional } = options;

  return check(fields)
    .custom((_, { req: { file } }) => {
      // 필수값(optional = true) 이면서 파일이 없는 경우 에러 메세지 반환
      if (!optional && !file) {
        return false;
      }

      return true;
    })
    .withMessage("이미지 파일을 추가해 주세요.")
    .custom((_, { req: { file } }) => {
      // 선택값(optional = false) 이면서 파일이 없는 경우 확장자 검사 패스
      if (optional && !file) {
        return true;
      }

      const extensionName = extname(file.originalname); // 확장자명('.' 포함)

      const allowedExtensions = [
        "jpg",
        "jpeg",
        "jfif",
        "png",
        "gif",
        "bmp",
        "webp",
        "tif",
        "tiff",
      ];

      const extensionPattern = `\\.(${allowedExtensions.join("|")})$`;
      const regex = RegExp(extensionPattern, "i");

      return regex.test(extensionName);
    })
    .withMessage("허용된 파일 확장자가 아닙니다.");
};

export default imageFileChain;
