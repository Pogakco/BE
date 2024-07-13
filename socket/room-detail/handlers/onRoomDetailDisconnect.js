import {
  SOCKET_TIMER_ERRORS,
  SOCKET_TIMER_EVENTS,
} from "../../../constants.js";
import pool from "../../../db/pool.js";
import roomService from "../../../services/roomService.js";
import getAllLinkedUserIdsFromNamespace from "../../helpers/getAllLinkedUserIdsFromNamespace.js";
import getUserIdFromSocket from "../../helpers/getUserIdFromSocket.js";
import getRoomIdFromNamespace from "../helpers/getRoomIdFromNamespace.js";

const onRoomDetailDisconnect = async (socket) => {
  const roomId = getRoomIdFromNamespace(socket.nsp);
  const userId = getUserIdFromSocket(socket);

  socket.leave(roomId);

  if (userId) {
    // 소켓에 연결된 유저 아이디 목록 클라이언트에 동기화
    const roomDetailNamespace = socket.nsp;
    roomDetailNamespace
      .to(roomId)
      .emit(
        SOCKET_TIMER_EVENTS.SYNC_ALL_LINKED_USER_IDS,
        getAllLinkedUserIdsFromNamespace(roomDetailNamespace)
      );

    // inactive 상태로 DB Update
    await roomService.inactiveParticipant({ roomId, userId });

    // 참가자 목록 클라이언트에 동기화
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

  console.log("user disconnected");
};

export default onRoomDetailDisconnect;
