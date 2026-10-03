import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { aiRateLimiter } from "../middleware/rateLimiters";
import { generateAiContent } from "../controllers/aiController";

const router = Router();

router.use(requireAuth, aiRateLimiter);
router.post("/generate", generateAiContent);

export default router;
