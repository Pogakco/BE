import {
  SOCKET_DEFAULT_EVENTS,
  SOCKET_TIMER_ERRORS,
  SOCKET_TIMER_EVENTS,
} from "../../../constants.js";
import roomService from "../../../services/roomService.js";
import getAllLinkedUserIdsFromNamespace from "../../helpers/getAllLinkedUserIdsFromNamespace.js";
import getRoomIdFromNamespace from "../helpers/getRoomIdFromNamespace.js";
import getRoomInfoSafety from "../helpers/getRoomInfoSafety.js";
import registerRoomDetailEventsInterceptor from "../helpers/registerRoomDetailEventsInterceptor.js";
import onDeleteRoom from "./onDeleteRoom.js";
import onRoomDetailDisconnect from "./onRoomDetailDisconnect.js";
import onStartCycles from "./onStartCycles.js";

const onConnection = async (socket) => {
  registerRoomDetailEventsInterceptor(socket);

  const roomDetailNamespace = socket.nsp;
  const roomId = getRoomIdFromNamespace(roomDetailNamespace);
  socket.join(roomId);

  // 모든 로그인한 유저 정보 동기화
  roomDetailNamespace
    .to(roomId)
    .emit(
      SOCKET_TIMER_EVENTS.SYNC_ALL_LINKED_USER_IDS,
      getAllLinkedUserIdsFromNamespace(roomDetailNamespace)
    );

  // 방의 타이머 진행 상태 동기화
  const { roomInfo, isErrorGetRoomInfo } = await getRoomInfoSafety({
    socket,
  });
  if (isErrorGetRoomInfo) {
    socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
      message: SOCKET_TIMER_ERRORS.INTERNAL_SERVER_ERROR,
    });
    return;
  }
  roomDetailNamespace
    .to(roomId)
    .emit(SOCKET_TIMER_EVENTS.SYNC_IS_RUNNING, roomInfo.isRunning);

  // 참가자 정보 동기화
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

  console.log("A user connected to room:", roomId);

  // 리스닝 이벤트 등록
  socket.on(SOCKET_TIMER_EVENTS.START_CYCLES, () => onStartCycles(socket));
  socket.on(SOCKET_TIMER_EVENTS.DELETE_ROOM, () => onDeleteRoom(socket));
  socket.on(SOCKET_DEFAULT_EVENTS.DISCONNECT, () =>
    onRoomDetailDisconnect(socket)
  );
};

export default onConnection;
