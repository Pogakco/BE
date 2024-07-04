export const ACCESS_TOKEN_KEY = "access_token";

export const IS_DEV_MODE = process.env.NODE_ENV === "development";

export const SOCKET_DEFAULT_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
};

export const SOCKET_TIMER_EVENTS = {
  START_CYCLES: "start-cycles",
  SYNC_STARTED_AT: "sync-started-at",
  SYNC_IS_RUNNING: "sync-is-running",
  SYNC_ALL_PARTICIPANTS: "sync-all-participants",
  SYNC_CURRENT_CYCLES: "sync-current-cycles",
  ERROR: "timer-error",
};
