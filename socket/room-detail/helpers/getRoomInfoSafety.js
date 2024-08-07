import camelcaseKeys from "camelcase-keys";
import {
  SOCKET_TIMER_ERRORS,
  SOCKET_TIMER_EVENTS,
} from "../../../constants.js";
import pool from "../../../db/pool.js";
import roomService from "../../../services/roomService.js";
import getRoomIdFromNamespace from "./getRoomIdFromNamespace.js";

const getRoomInfoSafety = async ({ socket }) => {
  const connection = await pool.getConnection();

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
      message: SOCKET_TIMER_ERRORS.INTERNAL_SERVER_ERROR,
    });
    console.error(error);
    isErrorGetRoomInfo = true;
  } finally {
    connection.release();
  }

  return { roomInfo, isErrorGetRoomInfo };
};

export default getRoomInfoSafety;
