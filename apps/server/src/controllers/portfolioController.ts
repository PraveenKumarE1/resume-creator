import { Response } from "express";
import { portfolioSchema } from "@portify/shared";
import { Portfolio } from "../models/Portfolio";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";
import { computePortfolioScore } from "../services/scoreService";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

async function generateUniqueSlug(base: string): Promise<string> {
  let slug = slugify(base) || `user-${Date.now()}`;
  let suffix = 0;
  while (await Portfolio.exists({ slug: suffix ? `${slug}-${suffix}` : slug })) {
    suffix += 1;
  }
  return suffix ? `${slug}-${suffix}` : slug;
}

export const getMyPortfolio = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const portfolio = await Portfolio.findOne({ userId: req.user!.id });
  if (!portfolio) {
    return res.json({ success: true, data: { portfolio: null } });
  }
  const score = computePortfolioScore(portfolio);
  res.json({ success: true, data: { portfolio: { ...portfolio.toJSON(), score } } });
});

export const upsertMyPortfolio = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const input = portfolioSchema.partial({ slug: true }).parse(req.body);

  let portfolio = await Portfolio.findOne({ userId: req.user!.id });

  if (!portfolio) {
    const slug = await generateUniqueSlug(input.fullName || req.user!.email.split("@")[0]);
    portfolio = await Portfolio.create({ ...input, userId: req.user!.id, slug });
  } else {
    Object.assign(portfolio, input);
    await portfolio.save();
  }

  const score = computePortfolioScore(portfolio);
  res.json({ success: true, data: { portfolio: { ...portfolio.toJSON(), score } } });
});

export const publishMyPortfolio = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const portfolio = await Portfolio.findOne({ userId: req.user!.id });
  if (!portfolio) throw AppError.notFound("Create your portfolio before publishing");
  portfolio.published = Boolean(req.body.published ?? true);
  await portfolio.save();
  res.json({ success: true, data: { portfolio: portfolio.toJSON() } });
});

export const getPublicPortfolio = asyncHandler(async (req, res: Response) => {
  const portfolio = await Portfolio.findOne({ slug: req.params.slug, published: true });
  if (!portfolio) throw AppError.notFound("Portfolio not found");
  portfolio.views = (portfolio.views ?? 0) + 1;
  await portfolio.save();
  res.json({ success: true, data: { portfolio: portfolio.toJSON() } });
});
