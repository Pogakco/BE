import express from "express";
import roomController from "../controllers/roomController.js";
import roomValidator from "../validators/roomValidator.js";
import injectUserId from "../validators/middlewares/injectUserId.js";
import loginRequired from "../validators/middlewares/loginRequired.js";

const router = express.Router();
router.use(express.json());

router.get(
  "/",
  [injectUserId, ...roomValidator.getAllRoomsValidator()],
  roomController.getRooms
);

router.post(
  "/",
  [loginRequired, ...roomValidator.getCreateRoomValidator()],
  roomController.createRoom
);

router.get(
  "/my-rooms",
  [loginRequired, ...roomValidator.getAllRoomsValidator()],
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
