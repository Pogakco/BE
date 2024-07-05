import camelcaseKeys from "camelcase-keys";
import {
  SOCKET_TIMER_ERRORS,
  SOCKET_TIMER_EVENTS,
} from "../../../constants.js";
import roomService from "../../../services/roomService.js";
import getRoomIdFromNamespace from "./getRoomIdFromNamespace.js";

const getRoomInfoSafety = async ({ connection, socket }) => {
  let roomInfo = null;
  let isErrorGetRoomInfo = false;

  const roomId = getRoomIdFromNamespace(socket.nsp);

  try {
    const data = await roomService.getRoomById({
      connection,
      roomId,
    });
    roomInfo = camelcaseKeys(data);
  } catch (error) {
    socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
      message: SOCKET_TIMER_ERRORS.DEFAULT,
    });
    console.error(error);
    connection.release();
    isErrorGetRoomInfo = true;
  }

  return { roomInfo, isErrorGetRoomInfo };
};

export default getRoomInfoSafety;
