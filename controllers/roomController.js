import { StatusCodes } from "http-status-codes";
import errorHandler from "./helpers/errorHandler.js";
import roomListService from "../services/roomListService.js";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../constants.js";
import roomService from "../services/roomService.js";

const roomController = {
  getRooms: errorHandler(async (req, res) => {
    const {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      is_running: isRunning,
    } = req.query;
    const { connection } = req;

    const rooms = await roomListService.getRooms({
      connection,
      page,
      limit,
      isRunning,
    });

    return res.status(StatusCodes.OK).json(rooms);
  }),

  getRoomDetail: errorHandler(async (req, res) => {
    const roomId = parseInt(req.params.id);
    const { connection } = req;

    const room = await roomService.getRoomById({ connection, roomId });
    if (!room.id) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 방입니다." });
    }
    return res.status(StatusCodes.OK).json(room);
  }),

  getRoomUsers: errorHandler(async (req, res) => {
    const roomId = parseInt(req.params.id);
    const { connection } = req;

    const room = await roomService.getRoomById({ connection, roomId });
    if (!room.id) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 방입니다." });
    }
    const users = await roomService.getUsersInRoom({ connection, roomId });
    return res.status(StatusCodes.OK).json(users);
  }),
};

export default roomController;
