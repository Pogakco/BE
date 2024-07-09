import { check } from "express-validator";
import { extname } from "path";

export const imageFile = (fields) => {
  return check(fields).custom((_, { req: { file } }) => {
    const extensionName = extname(file.originalname); // 확장자명('.' 포함)

    const allowedExtensions = [
      "jpg",
      "jpeg",
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
  });
};
