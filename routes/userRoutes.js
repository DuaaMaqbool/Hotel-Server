import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
  getUserData,
  storeRecentSearchedCities,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", requireAuth, getUserData);
userRouter.post("/store-recent-search", requireAuth, storeRecentSearchedCities);

export default userRouter;
