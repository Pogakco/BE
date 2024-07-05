import express from "express";
import roomController from "../controllers/roomController.js";
import roomValidator from "../validators/roomValidator.js";

const router = express.Router();
router.use(express.json());

router.get(
  "/",
  [...roomValidator.getAllRoomsValidator()],
  roomController.getRooms
);

router.get(
  "/:id",
  [...roomValidator.getRoomDetailValidator()],
  roomController.getRoomDetail
);

router.get(
  "/:id/users",
  [...roomValidator.getRoomDetailValidator()],
  roomController.getRoomUsers
);

export default router;
