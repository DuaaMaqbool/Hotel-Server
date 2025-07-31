// protectedRoutes.js
import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  res.status(200).json({
    message: "Protected bookings route accessed",
    user: req.user,
  });
})

export default router;


