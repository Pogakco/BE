import { StatusCodes } from "http-status-codes";
import errorHandler from "./helpers/errorHandler.js";
import roomListService from "../services/roomListService.js";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../constants.js";

const roomController = {
  getRooms: errorHandler(async (req, res) => {
    const {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      is_running,
    } = req.query;
    const { connection } = req;

    const rooms = await roomListService.getRooms({
      connection,
      page,
      limit,
      is_running,
    });

    return res.status(StatusCodes.OK).json(rooms);
  }),
};

export default roomController;
