import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getMyPortfolio, publishMyPortfolio, upsertMyPortfolio } from "../controllers/portfolioController";

const router = Router();

router.use(requireAuth);
router.get("/me", getMyPortfolio);
router.put("/me", upsertMyPortfolio);
router.post("/me/publish", publishMyPortfolio);

export default router;
