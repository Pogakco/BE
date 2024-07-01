import { Server } from "socket.io";

const createIo = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  return io;
};

export default createIo;
