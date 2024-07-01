import express from "express";
import roomController from "../controllers/roomController.js";

const router = express.Router();
router.use(express.json());

router.get("/rooms", roomController.getRooms);

export default router;
