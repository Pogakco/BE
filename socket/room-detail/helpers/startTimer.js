import { SOCKET_TIMER_EVENTS } from "../../../constants.js";
import roomService from "../../../services/roomService.js";
import timerService from "../../../services/timerService.js";
import getAllLinkedUserIdsFromNamespace from "../../helpers/getAllLinkedUserIdsFromNamespace.js";
import getRoomIdFromNamespace from "./getRoomIdFromNamespace.js";

const startTimer = async ({ socket }) => {
  const roomDetailNamespace = socket.nsp;
  const roomId = getRoomIdFromNamespace(roomDetailNamespace);
  const allLinkedUserIds =
    getAllLinkedUserIdsFromNamespace(roomDetailNamespace);

  const startedAt = await timerService.startTimer({
    roomId,
    userIds: allLinkedUserIds,
  });
  const { users: allParticipants } =
    await roomService.getRoomUsersAndActiveCount({ roomId });

  roomDetailNamespace
    .to(roomId)
    .emit(SOCKET_TIMER_EVENTS.SYNC_STARTED_AT, startedAt);
  roomDetailNamespace
    .to(roomId)
    .emit(SOCKET_TIMER_EVENTS.SYNC_ALL_PARTICIPANTS, allParticipants);
  roomDetailNamespace
    .to(roomId)
    .emit(SOCKET_TIMER_EVENTS.SYNC_IS_RUNNING, true);
};

export default startTimer;
