import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post("/", requireAuth, registerHotel);

export default hotelRouter;
