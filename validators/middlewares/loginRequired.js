import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_KEY } from "../../constants.js";

const loginRequired = (req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN_KEY];

  if (!accessToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "토큰이 존재하지 않습니다." });
  }

  try {
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    const decodedJwt = jwt.verify(accessToken, JWT_PRIVATE_KEY);
    req.userId = decodedJwt.id;
    next();
  } catch (error) {
    // JWT 에러라면 쿠키 제거
    if (error instanceof jwt.JsonWebTokenError) {
      res.clearCookie(ACCESS_TOKEN_KEY);
    }

    // 에러 케이스에 맞춰서 메세지 return
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "토큰이 만기되었습니다." });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "유효하지 않은 토큰입니다." });
    }
    if (error instanceof jwt.NotBeforeError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "토큰이 비활성화 상태입니다." });
    }
  }
};

export default loginRequired;
