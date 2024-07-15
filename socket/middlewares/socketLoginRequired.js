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
    // prependAny같이, onConnection에서 next 없이 미들웨어를 사용하기 위해 정의
    const nextSafety = (error) => {
      return next && next(error);
    };

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
      return nextSafety(error);
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
      console.log("[인증]비로그인 유저");
      return nextSafety();
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
        return nextSafety();
      }

      // 클라이언트 측에서 인증 API를 호출해서 쿠키를 제거 하고, 에러 토스트 메세지 반환
      socket.emit(SOCKET_COMMON_EVENTS.AUTH_ERROR);

      return nextSafety();
    }

    if (newAccessToken) {
      console.log("[인증]로그인 유저 토큰 재발급 요청");
      // 클라이언트에서 인증 API 호출을 통해 토큰 재발급
      socket.emit(SOCKET_COMMON_EVENTS.REQUEST_AUTH);
    }

    if (!newAccessToken) {
      console.log("[인증]로그인 유저 인증 성공");
    }

    socket.userId = userId;

    return nextSafety();
  };
};

export default socketLoginRequired;
