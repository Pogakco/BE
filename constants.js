export const IS_DEV_MODE = process.env.NODE_ENV === "development";

export const SOCKET_DEFAULT_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
};

export const SOCKET_COMMON_EVENTS = {
  REQUEST_AUTH: "request-auth",
  AUTH_ERROR: "auth-error",
};

export const SOCKET_TIMER_EVENTS = {
  SYNC_ALL_LINKED_USER_IDS: "sync-all-linked-user-ids",
  SYNC_CURRENT_SERVER_TIME: "sync-current-server-time",
  START_CYCLES: "start-cycles",
  SYNC_STARTED_AT: "sync-started-at",
  SYNC_IS_RUNNING: "sync-is-running",
  SYNC_ALL_PARTICIPANTS: "sync-all-participants",
  SYNC_CURRENT_CYCLES: "sync-current-cycles",
  ROOM_DELETED: "room-deleted",
  DELETE_ROOM: "delete-room",
  ERROR: "timer-error",
};

export const SOCKET_TIMER_ERRORS = {
  IS_NOT_OWNER: "방장 권한이 없습니다.",
  INTERNAL_SERVER_ERROR: "서버 오류가 발생했습니다.",
  NOT_FOUND_ROOM: "존재하지 않는 방입니다.",
  PROHIBIT_DELETE_RUNNING_ROOM: "사이클이 진행 중인 방은 삭제할 수 없습니다.",
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 9;

/* AWS S3 DIRECTORY */
const PRODUCTION_AWS_S3_DIRECTORY = {
  DEFAULT: "default",
  USER_PROFILE_IMAGE: "users/profile-image",
};
const DEVELOPMENT_AWS_S3_DIRECTORY = Object.fromEntries(
  Object.entries(PRODUCTION_AWS_S3_DIRECTORY).map(([key, value]) => [
    key,
    `dev/${value}`,
  ])
);
export const AWS_S3_DIRECTORY = IS_DEV_MODE
  ? DEVELOPMENT_AWS_S3_DIRECTORY
  : PRODUCTION_AWS_S3_DIRECTORY;
/* ---------------- */

export const SECOND_MS = 1000;
export const MINUTE_MS = 60 * SECOND_MS;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

export const ACCESS_TOKEN_KEY = "access_token";
export const ACCESS_TOKEN_EXPIRES_IN = "30m";
export const ACCESS_TOKEN_ISSUER = "pogakco";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const REFRESH_TOKEN_MAX_AGE = 14 * DAY_MS;
export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !IS_DEV_MODE,
  sameSite: "lax",
  maxAge: REFRESH_TOKEN_MAX_AGE, // Access Token이 사라지면 Refresh Token을 통해 재발급 받을 수 없으므로 길게 설정했지만 코드 개선 필요
};
export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !IS_DEV_MODE,
  sameSite: "lax",
  maxAge: REFRESH_TOKEN_MAX_AGE,
};

export const AUTHENTICATE_ERROR_TYPE = {
  TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND",
  EXPIRED_REFRESH_TOKEN: "EXPIRED_REFRESH_TOKEN",
  INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN",
  INVALID_ACCESS_TOKEN: "INVALID_ACCESS_TOKEN",
};

export const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";
