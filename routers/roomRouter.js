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
  [...roomValidator.getRoomDetailValidatr()],
  roomController.getRoomDetail
);

router.get(
  "/:id/users",
  [...roomValidator.getRoomDetailValidatr()],
  roomController.getRoomUsers
);

export default router;
