import express from "express";
import roomController from "../controllers/roomController.js";
import loginRequired from "../validators/middlewares/loginRequired.js";
import roomValidator from "../validators/roomValidator.js";

const router = express.Router();
router.use(express.json());

router.get(
  "/",
  [
    loginRequired({ allowAnonymous: true }),
    ...roomValidator.getAllRoomsValidator(),
  ],
  roomController.getRooms
);

router.post(
  "/",
  [loginRequired(), ...roomValidator.getCreateRoomValidator()],
  roomController.createRoom
);

router.get(
  "/my-rooms",
  [loginRequired(), ...roomValidator.getAllRoomsValidator()],
  roomController.getMyRooms
);

router.get(
  "/:id",
  [...roomValidator.getRoomDetailValidator()],
  roomController.getRoomDetail
);

router.post(
  "/:id/join",
  [loginRequired(), ...roomValidator.getRoomDetailValidator()],
  roomController.joinRoom
);

router.delete(
  "/:id/leave",
  [loginRequired(), ...roomValidator.getRoomDetailValidator()],
  roomController.leaveRoom
);

router.get(
  "/:id/users",
  [...roomValidator.getRoomDetailValidator()],
  roomController.getRoomUsersInfo
);

export default router;
