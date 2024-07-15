import {
  SOCKET_COMMON_EVENTS,
  SOCKET_TIMER_EVENTS,
} from "../../../constants.js";
import roomService from "../../../services/roomService.js";
import getAllLinkedUserIdsFromNamespace from "../../helpers/getAllLinkedUserIdsFromNamespace.js";
import getUserIdFromSocket from "../../helpers/getUserIdFromSocket.js";
import socketLoginRequired from "../../middlewares/socketLoginRequired.js";
import getRoomIdFromNamespace from "./getRoomIdFromNamespace.js";

const registerRoomDetailEventsInterceptor = (socket) => {
  const roomDetailNamespace = socket.nsp;
  const roomId = getRoomIdFromNamespace(roomDetailNamespace);
  const userId = getUserIdFromSocket(socket);

  socket.prependAny(async (event, ...args) => {
    // 사이클 시작, 방 삭제 이벤트 요청시 인증
    if (
      event === SOCKET_TIMER_EVENTS.DELETE_ROOM ||
      event === SOCKET_TIMER_EVENTS.START_CYCLES
    ) {
      
      await socketLoginRequired()(socket);

      return;
    }
  });

  socket.prependAnyOutgoing(async (event, ...args) => {
    // 사이클이 시작될 때 모든 클라이언트를 인증
    if (event === SOCKET_TIMER_EVENTS.SYNC_IS_RUNNING) {
      const isRunning = args[0];
      if (!isRunning) {
        return;
      }

      socketLoginRequired({ allowAnonymous: true })(socket);

      return;
    }

    // 인증 에러를 전파하기 전에 참가자를 inactive 상태로 변경, 유저 id 목록 동기화
    if (event === SOCKET_COMMON_EVENTS.AUTH_ERROR) {
      try {
        await roomService.inactiveParticipant({ roomId, userId });

        socket.userId = null;
        roomDetailNamespace
          .to(roomId)
          .emit(
            SOCKET_TIMER_EVENTS.SYNC_ALL_LINKED_USER_IDS,
            getAllLinkedUserIdsFromNamespace(roomDetailNamespace)
          );
          
        return;
      } catch (error) {
        socket.disconnect();
        console.error(error);
      }
    }
  });
};

export default registerRoomDetailEventsInterceptor;
