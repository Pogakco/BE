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
  ERROR: "timer-error",
};

export const SOCKET_TIMER_ERRORS = {
  DEFAULT: "타이머 소켓에서 오류가 발생했습니다.",
  IS_NOT_OWNER: "방장만 타이머를 시작할 수 있습니다.",
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 9;
