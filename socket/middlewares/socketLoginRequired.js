import cookie from "cookie";
import {
  ACCESS_TOKEN_KEY,
  AUTHENTICATE_ERROR_TYPE,
  REFRESH_TOKEN_KEY,
  SOCKET_COMMON_EVENTS,
} from "../../constants.js";
import userService from "../../services/userService.js";

const defaultOptions = {
  allowAnonymous: false,
  skipAuthError: false,
};

const socketLoginRequired = (options = defaultOptions) => {
  const { allowAnonymous, skipAuthError } = { ...defaultOptions, ...options };

  return async (socket, next) => {
    const rawCookies = socket.handshake.headers.cookie || "";
    const cookies = cookie.parse(rawCookies);

    const accessToken = cookies[ACCESS_TOKEN_KEY];
    const refreshToken = cookies[REFRESH_TOKEN_KEY];

    let authenticateResult = null;
    try {
      authenticateResult = await userService.authenticate({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }

    const {
      authErrorType,
      isAuthError,
      authErrorMessage,
      userId,
      newAccessToken,
    } = authenticateResult;

    if (
      allowAnonymous &&
      authErrorType === AUTHENTICATE_ERROR_TYPE.TOKEN_NOT_FOUND
    ) {
      return next();
    }

    if (isAuthError) {
      // onConnection 핸들러에 넘겨질 쿠키도 제거
      if (cookies[ACCESS_TOKEN_KEY]) {
        socket.handshake.headers.cookie = cookie.serialize(ACCESS_TOKEN_KEY, {
          expires: new Date(0),
        });
      }
      if (cookies[REFRESH_TOKEN_KEY]) {
        socket.handshake.headers.cookie = cookie.serialize(REFRESH_TOKEN_KEY, {
          expires: new Date(0),
        });
      }

      if (skipAuthError) {
        return next();
      }

      // 클라이언트 측에서 인증 API를 호출해서 쿠키를 제거 하고, 에러 토스트 메세지 반환
      socket.emit(SOCKET_COMMON_EVENTS.AUTH_ERROR);

      return next();
    }

    if (newAccessToken) {
      // 클라이언트에서 인증 API 호출을 통해 토큰 재발급
      socket.emit(SOCKET_COMMON_EVENTS.REQUEST_AUTH);
    }

    socket.userId = userId;

    return next();
  };
};

export default socketLoginRequired;
