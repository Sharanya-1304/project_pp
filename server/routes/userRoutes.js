import express from "express";
import { getProfile, getLeaderboard, updateProfile, dashboardData, searchUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", getProfile);
router.get("/leaderboard", getLeaderboard);
router.get("/dashboard", dashboardData);
router.get("/search", searchUsers);
router.post("/update", updateProfile);

export default router;
