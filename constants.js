export const ACCESS_TOKEN_KEY = "access_token";

export const IS_DEV_MODE = process.env.NODE_ENV === "development";

export const SOCKET_DEFAULT_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
};

export const SOCKET_TIMER_EVENTS = {
  SYNC_ALL_LINKED_USER_IDS: "sync-all-linked-user-ids",
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
  PROHIBIT_DELETE_RUNNING_ROOM: "집중 중인 방은 삭제할 수 없습니다.",
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
