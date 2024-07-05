import { Server } from "socket.io";
import { IS_DEV_MODE } from "../../constants.js";

const createIo = (server) => {
  const io = new Server(server, {
    cors: {
      origin: IS_DEV_MODE ? "http://localhost:5173" : undefined,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  return io;
};

export default createIo;
