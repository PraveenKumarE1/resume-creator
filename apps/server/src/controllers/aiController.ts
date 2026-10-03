import { Response } from "express";
import { aiRequestSchema } from "@portify/shared";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";
import { runAiAction } from "../ai";

export const generateAiContent = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const input = aiRequestSchema.parse(req.body);
  const output = await runAiAction(input.action, input.input);
  res.json({ success: true, data: { output } });
});
