import {
  SOCKET_DEFAULT_EVENTS,
  SOCKET_TIMER_ERRORS,
  SOCKET_TIMER_EVENTS,
} from "../../../constants.js";
import roomService from "../../../services/roomService.js";
import getAllLinkedUserIdsFromNamespace from "../../helpers/getAllLinkedUserIdsFromNamespace.js";
import getUserIdFromSocket from "../../helpers/getUserIdFromSocket.js";
import getRoomIdFromNamespace from "../helpers/getRoomIdFromNamespace.js";
import onDeleteRoom from "./onDeleteRoom.js";
import onRoomDetailDisconnect from "./onRoomDetailDisconnect.js";
import onStartCycles from "./onStartCycles.js";

const onConnection = async (socket) => {
  const roomId = getRoomIdFromNamespace(socket.nsp);
  const userId = getUserIdFromSocket(socket);

  socket.join(roomId);

  // 로그인 한 유저일 때만 클라이언트에 동기화
  if (userId) {
    const roomDetailNamespace = socket.nsp;
    roomDetailNamespace
      .to(roomId)
      .emit(
        SOCKET_TIMER_EVENTS.SYNC_ALL_LINKED_USER_IDS,
        getAllLinkedUserIdsFromNamespace(roomDetailNamespace)
      );

    try {
      const { users: allParticipants } =
        await roomService.getRoomUsersAndActiveCount({ roomId });

      roomDetailNamespace
        .to(roomId)
        .emit(SOCKET_TIMER_EVENTS.SYNC_ALL_PARTICIPANTS, allParticipants);
    } catch (error) {
      socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
        message: SOCKET_TIMER_ERRORS.INTERNAL_SERVER_ERROR,
      });
      return;
    }
  }

  console.log("A user connected to room:", roomId);

  socket.on(SOCKET_TIMER_EVENTS.START_CYCLES, () => onStartCycles(socket));
  socket.on(SOCKET_TIMER_EVENTS.DELETE_ROOM, () => onDeleteRoom(socket));
  socket.on(SOCKET_DEFAULT_EVENTS.DISCONNECT, () =>
    onRoomDetailDisconnect(socket)
  );
};

export default onConnection;
