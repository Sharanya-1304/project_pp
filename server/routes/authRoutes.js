import express from "express";
import { 
  signupUser, 
  loginUser, 
  logoutUser, 
  forgotPassword, 
  resetPassword,
  verifyEmail,
  verifyOTP,
  resendOTP
} from "../controllers/authController.js";

const router = express.Router();

// Auth endpoints
router.post("/signup", signupUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email", verifyEmail);

export default router;
