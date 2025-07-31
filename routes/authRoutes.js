// File: ./routes/authRoutes.js

import express from "express";
import { 
    login, 
    signup, 
    forgotPassword, 
    verifyOTP, 
    resetPasswordController, 
    logoutUser, 
    checkAuth 
} from "../controllers/authController.js";

const router = express.Router();

// Define the API routes and link them to the controller functions
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post('/reset-password', resetPasswordController);
router.post("/logout", logoutUser);

// 💡 This is the crucial line: it must be a GET request to match your frontend.
router.get('/check-auth', checkAuth);


export default router;