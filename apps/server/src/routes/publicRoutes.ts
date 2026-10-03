import { Router } from "express";
import { getPublicPortfolio } from "../controllers/portfolioController";

const router = Router();

router.get("/:slug", getPublicPortfolio);

export default router;
