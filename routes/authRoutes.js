import express from "express";
import { login, signup, forgotPassword, verifyOTP, resetPasswordController, logoutUser, checkAuth  } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post('/reset-password', resetPasswordController);
router.post("/logout", logoutUser);
router.post('check-auth', checkAuth)


export default router;