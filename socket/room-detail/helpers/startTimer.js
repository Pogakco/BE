import { SOCKET_TIMER_EVENTS } from "../../../constants.js";
import timerService from "../../../services/timerService.js";
import getAllLinkedUserIdsFromNamespace from "../../helpers/getAllLinkedUserIdsFromNamespace.js";
import getRoomIdFromNamespace from "./getRoomIdFromNamespace.js";

const startTimer = async ({ connection, socket }) => {
  const roomDetailNamespace = socket.nsp;
  const roomId = getRoomIdFromNamespace(roomDetailNamespace);
  const allLinkedUserIds =
    getAllLinkedUserIdsFromNamespace(roomDetailNamespace);

  const startedAt = await timerService.startTimer({
    connection,
    roomId,
    userIds: allLinkedUserIds,
  });

  roomDetailNamespace
    .to(roomId)
    .emit(SOCKET_TIMER_EVENTS.SYNC_STARTED_AT, startedAt);
  roomDetailNamespace
    .to(roomId)
    .emit(SOCKET_TIMER_EVENTS.SYNC_IS_RUNNING, true);
};

export default startTimer;
