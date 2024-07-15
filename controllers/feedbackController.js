import { StatusCodes } from "http-status-codes";
import errorHandler from "./helpers/errorHandler.js";
import feedbackService from "../services/feedbackService.js";

const feedbackController = {
  postFeedback: errorHandler(async (req, res) => {
    const { contents } = req.body;
    const { connection } = req;
    await feedbackService.postFeedback({ connection, contents });
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "피드백이 성공적으로 제출되었습니다." });
  }),
};

export default feedbackController;
