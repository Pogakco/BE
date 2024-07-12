import {
  SOCKET_TIMER_ERRORS,
  SOCKET_TIMER_EVENTS,
} from "../../../constants.js";
import roomService from "../../../services/roomService.js";
import getUserIdFromSocket from "../../helpers/getUserIdFromSocket.js";
import getRoomIdFromNamespace from "../helpers/getRoomIdFromNamespace.js";
import getRoomInfoSafety from "../helpers/getRoomInfoSafety.js";

const onDeleteRoom = async (socket) => {
  const { roomInfo, isErrorGetRoomInfo } = await getRoomInfoSafety({
    socket,
  });

  if (isErrorGetRoomInfo) {
    socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
      message: SOCKET_TIMER_ERRORS.INTERNAL_SERVER_ERROR,
    });
    return;
  }

  if (!roomInfo) {
    socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
      message: SOCKET_TIMER_ERRORS.NOT_FOUND_ROOM,
    });
    return;
  }

  const userId = getUserIdFromSocket(socket);
  if (roomInfo.ownerId !== userId) {
    socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
      message: SOCKET_TIMER_ERRORS.IS_NOT_OWNER,
    });
    return;
  }

  if (roomInfo.isRunning) {
    socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
      message: SOCKET_TIMER_ERRORS.PROHIBIT_DELETE_RUNNING_ROOM,
    });
    return;
  }

  try {
    const roomDetailNamespace = socket.nsp;
    const roomId = getRoomIdFromNamespace(roomDetailNamespace);

    await roomService.deleteRoom({ roomId });

    roomDetailNamespace.to(roomId).emit(SOCKET_TIMER_EVENTS.ROOM_DELETED);
  } catch (error) {
    console.log(error);

    socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
      message: SOCKET_TIMER_ERRORS.INTERNAL_SERVER_ERROR,
    });
  }
};

export default onDeleteRoom;
