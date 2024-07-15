import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { SOCKET_DEFAULT_EVENTS } from "./constants.js";
import checkDBConnection from "./db/helpers/checkDBConnection.js";
import convertSnakeToCamelResponse from "./middlewares/convertSnakeToCamelResponse.js";
import defaultErrorHandler from "./middlewares/defaultErrorHandler.js";
import userRouter from "./routers/userRouter.js";
import createIo from "./socket/helpers/createIo.js";
import onRoomDetailConnection from "./socket/room-detail/handlers/onRoomDetailConnection.js";
import roomRouter from "./routers/roomRouter.js";
import feedbackRouter from "./routers/feedbackRouter.js";

checkDBConnection();

const port = 3000;

const app = express();
const server = createServer(app);

const io = createIo(server);
const roomDetailNamespace = io.of(/^\/rooms\/\d+$/);
roomDetailNamespace.on(
  SOCKET_DEFAULT_EVENTS.CONNECTION,
  onRoomDetailConnection
);

app.use(express.json());
app.use(convertSnakeToCamelResponse());
app.use(cookieParser());

app.use("/", userRouter);
app.use("/rooms", roomRouter);
app.use("/feedbacks", feedbackRouter);

app.use(defaultErrorHandler);

server.listen(port);
