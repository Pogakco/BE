import getRoomIdFromSocket from "../../helpers/getRoomIdFromSocket.js";
import socketErrorHandler from "../../helpers/socketErrorHandler.js";
import startCycles from "./startCycles.js";

const onConnection = (socket) => {
  const roomId = getRoomIdFromSocket(socket);

  socket.join(roomId);

  console.log("A user connected to room:", roomId);

  socket.on("start-cycles", () => socketErrorHandler(startCycles(socket)));

  socket.on("disconnect", async () => {
    // TODO: 연결 끊기면 유저 비활성화 하는 로직 추가
    socket.leave(roomId);
    console.log("user disconnected");
  });
};

export default onConnection;
