import { StatusCodes } from "http-status-codes";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  ACCESS_TOKEN_KEY,
  AUTHENTICATE_ERROR_TYPE,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_KEY,
} from "../../constants.js";
import userService from "../../services/userService.js";

const defaultOptions = {
  allowAnonymous: false,
  skipAuthError: false,
};

const loginRequired = (options = defaultOptions) => {
  const { allowAnonymous, skipAuthError } = options;

  return async (req, res, next) => {
    const accessToken = req.cookies[ACCESS_TOKEN_KEY];
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];

    let authenticateResult = null;
    try {
      authenticateResult = await userService.authenticate({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return next(error);
    }

    const {
      authErrorType,
      isAuthError,
      authErrorMessage,
      newAccessToken,
      newRefreshToken,
      userId,
    } = authenticateResult;

    if (
      allowAnonymous &&
      authErrorType === AUTHENTICATE_ERROR_TYPE.TOKEN_NOT_FOUND
    ) {
      return next();
    }

    if (isAuthError) {
      res.clearCookie(ACCESS_TOKEN_KEY);
      res.clearCookie(REFRESH_TOKEN_KEY);

      // Controller에 넘겨질 req.cookies도 제거
      delete req.cookies[ACCESS_TOKEN_KEY];
      delete req.cookies[REFRESH_TOKEN_KEY];

      if (skipAuthError) {
        return next();
      }

      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: authErrorMessage });
    }

    if (newAccessToken && newRefreshToken) {
      res.cookie(ACCESS_TOKEN_KEY, newAccessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
      res.cookie(
        REFRESH_TOKEN_KEY,
        newRefreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS
      );

      // Controller에서 사용 될 req.cookies도 업데이트
      req.cookies[ACCESS_TOKEN_KEY] = newAccessToken;
      req.cookies[REFRESH_TOKEN_KEY] = newRefreshToken;
    }

    req.userId = userId;

    return next();
  };
};

export default loginRequired;
