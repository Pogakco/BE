import express from "express";
import feedbackController from "../controllers/feedbackController.js";
import feedbackValidator from "../validators/feedbackValidator.js";

const router = express.Router();
router.use(express.json());

router.post(
  "/",
  [...feedbackValidator.getFeedbackValidator()],
  feedbackController.postFeedback
);

export default router;
