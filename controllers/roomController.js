import { StatusCodes } from "http-status-codes";
import errorHandler from "./helpers/errorHandler.js";
import roomService from "../services/roomService.js";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../constants.js";

const roomController = {
  getRooms: errorHandler(async (req, res) => {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;
    const { connection } = req;

    const rooms = await roomService.getRooms({
      connection,
      page,
      limit,
    });

    return res.status(StatusCodes.OK).json(rooms);
  }),
};

export default roomController;
