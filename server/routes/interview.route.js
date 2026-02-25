import express from "express";
import isAuth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";
import {
  analyzeResume,
  generateQuestions,
  evaluateInterview,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume);
interviewRouter.post("/generate", generateQuestions);
interviewRouter.post("/evaluate", evaluateInterview);

export default interviewRouter;