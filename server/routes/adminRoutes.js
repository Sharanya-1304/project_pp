import express from "express";
import {
  addQuestion,
  getAllQuestions,
  getQuestionsByDifficulty,
  updateQuestion,
  deleteQuestion,
  getAdminStats,
  getAllUsersForAdmin,
  updateUserRole,
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Questions routes
router.post("/questions/add", verifyToken, addQuestion);
router.get("/questions", getAllQuestions);
router.get("/questions/difficulty/:difficulty", getQuestionsByDifficulty);
router.put("/questions/:questionId", verifyToken, updateQuestion);
router.delete("/questions/:questionId", verifyToken, deleteQuestion);

// Admin stats routes
router.get("/stats", verifyToken, getAdminStats);
router.get("/users", verifyToken, getAllUsersForAdmin);
router.put("/users/:userId/role", verifyToken, updateUserRole);

export default router;
