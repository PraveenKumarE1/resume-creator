import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth";
import { uploadResume } from "../controllers/resumeController";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

const router = Router();

router.post("/resume", requireAuth, upload.single("resume"), uploadResume);

export default router;
