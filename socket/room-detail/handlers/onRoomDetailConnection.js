import {
  SOCKET_DEFAULT_EVENTS,
  SOCKET_TIMER_EVENTS,
} from "../../../constants.js";
import getRoomIdFromNamespace from "../helpers/getRoomIdFromNamespace.js";
import onRoomDetailDisconnect from "./onRoomDetailDisconnect.js";
import onStartCycles from "./onStartCycles.js";

const onConnection = (socket) => {
  const roomId = getRoomIdFromNamespace(socket.nsp);

  socket.join(roomId);

  console.log("A user connected to room:", roomId);

  socket.on(SOCKET_TIMER_EVENTS.START_CYCLES, () => onStartCycles(socket));

  socket.on(SOCKET_DEFAULT_EVENTS.DISCONNECT, () =>
    onRoomDetailDisconnect(socket)
  );
};

export default onConnection;
