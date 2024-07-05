import pool from "../../../db/pool.js";
import roomService from "../../../services/roomService.js";
import getUserIdFromSocket from "../../helpers/getUserIdFromSocket.js";
import getRoomIdFromNamespace from "../helpers/getRoomIdFromNamespace.js";

const onRoomDetailDisconnect = async (socket) => {
  const connection = await pool.getConnection();

  const roomId = getRoomIdFromNamespace(socket.nsp);
  const userId = getUserIdFromSocket(socket);

  socket.leave(roomId);

  if (userId) {
    await roomService.inactiveParticipant({ connection, roomId, userId });
  }

  console.log("user disconnected");
};

export default onRoomDetailDisconnect;
