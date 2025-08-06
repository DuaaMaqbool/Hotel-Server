import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 4), requireAuth, createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", requireAuth, getOwnerRooms);
roomRouter.post("/toggle-availability", requireAuth, toggleRoomAvailability )


export default roomRouter;