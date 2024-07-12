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
    const { connection, userId } = req;

    const rooms = await roomListService.getRooms({
      connection,
      page,
      limit,
      isRunning,
      userId,
    });

    return res.status(StatusCodes.OK).json(rooms);
  }),

  getRoomDetail: errorHandler(async (req, res) => {
    const roomId = parseInt(req.params.id);
    const { connection } = req;

    const room = await roomService.getRoomById({ connection, roomId });
    if (!room) {
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
    if (!room) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 방입니다." });
    }
    const users = await roomService.getUsersInRoom({ connection, roomId });
    return res.status(StatusCodes.OK).json(users);
  }),

  getMyRooms: errorHandler(async (req, res) => {
    const {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      is_running: isRunning,
    } = req.query;
    const { connection, userId } = req;

    const myRooms = await roomListService.getRooms({
      connection,
      userId,
      page,
      limit,
      isRunning,
      isMyRoom: true,
    });

    return res.status(StatusCodes.OK).json(myRooms);
  }),

  createRoom: errorHandler(
    async (req, res) => {
      const { connection, userId } = req;
      const {
        roomTitle,
        roomDescription,
        focusTime,
        shortBreakTime,
        longBreakTime,
        totalCycles,
        maxParticipants,
      } = req.body;

      const result = await roomService.createRoom({
        connection,
        roomTitle,
        userId,
        roomDescription,
        focusTime,
        shortBreakTime,
        longBreakTime,
        totalCycles,
        maxParticipants,
      });

      return res.status(StatusCodes.OK).json(result);
    },
    { transaction: true }
  ),

  joinRoom: errorHandler(async (req, res) => {
    const { connection, userId } = req;
    const roomId = parseInt(req.params.id);

    const room = await roomService.getRoomById({ connection, roomId });
    if (!room) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 방입니다." });
    }

    const alreadyJoined = await roomService.checkUserAlreadyJoined({
      connection,
      roomId,
      userId,
    });

    if (alreadyJoined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "이미 참여하고 있는 방입니다." });
    }

    const isRoomFull = await roomService.checkRoomFull({
      connection,
      roomId,
    });
    if (isRoomFull) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "정원이 모두 찼습니다." });
    }

    if (room.isRunning) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "집중 중인 방에는 참여할 수 없습니다." });
    }

    await roomService.joinRoom({ connection, roomId, userId });
    return res.status(StatusCodes.NO_CONTENT).end();
  }),

  leaveRoom: errorHandler(async (req, res) => {
    const { connection, userId } = req;
    const roomId = parseInt(req.params.id);

    const room = await roomService.getRoomById({ connection, roomId });
    if (!room) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 방입니다." });
    }

    const alreadyJoined = await roomService.checkUserAlreadyJoined({
      connection,
      roomId,
      userId,
    });

    if (!alreadyJoined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "참여하지 않은 방입니다." });
    }

    if (room.ownerId === userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "방장은 방을 나갈 수 없습니다." });
    }

    await roomService.leaveRoom({ connection, roomId, userId });
    return res.status(StatusCodes.NO_CONTENT).end();
  }),

  deleteRoom: errorHandler(async (req, res) => {
    const { connection, userId } = req;
    const roomId = parseInt(req.params.id);

    const room = await roomService.getRoomById({ connection, roomId });
    if (!room) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 방입니다." });
    }

    if (room.ownerId !== userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "권한이 없습니다." });
    }

    await roomService.deleteRoom({ connection, roomId });
    return res.status(StatusCodes.NO_CONTENT).end();
  }),
};

export default roomController;
