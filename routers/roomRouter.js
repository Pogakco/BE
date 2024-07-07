import express from "express";
import roomController from "../controllers/roomController.js";
import roomValidator from "../validators/roomValidator.js";
import injectUserId from "../validators/middlewares/injectUserId.js";
import loginRequired from "../validators/middlewares/loginRequired.js";

const router = express.Router();
router.use(express.json());

router.get(
  "/",
  [...roomValidator.getAllRoomsValidator()],
  roomController.getRooms
);

router.post(
  "/",
  [...roomValidator.getCreateRoomValidator(), loginRequired],
  roomController.createRoom
);

router.get(
  "/my-rooms",
  [...roomValidator.getAllRoomsValidator(), loginRequired],
  roomController.getMyRooms
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
