import express from "express";
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  toggleLike,
  addComment,
  getAlumniProfile,
  getAllAlumni,
  verifyCompany,
  getCompaniesList,
} from "../controllers/alumniController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Experience routes
router.post("/experience/create", verifyToken, createExperience);
router.get("/experiences", getAllExperiences);
router.get("/experience/:experienceId", getExperienceById);
router.put("/experience/:experienceId", verifyToken, updateExperience);
router.delete("/experience/:experienceId", verifyToken, deleteExperience);

// Interaction routes
router.post("/experience/:experienceId/like", verifyToken, toggleLike);
router.post("/experience/:experienceId/comment", verifyToken, addComment);

// Alumni routes
router.get("/alumni/:userId", getAlumniProfile);
router.get("/alumni", getAllAlumni);

// Company verification
router.post("/company/verify", verifyCompany);
router.get("/companies", getCompaniesList);

export default router;
