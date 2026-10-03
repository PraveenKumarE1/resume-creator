import { Router } from "express";
import { login, logout, me, refresh, register } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";
import { authRateLimiter } from "../middleware/rateLimiters";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/refresh", authRateLimiter, refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
