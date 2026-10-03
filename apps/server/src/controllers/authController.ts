import { Request, Response } from "express";
import { loginSchema, registerSchema } from "@portify/shared";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { hashPassword, signAccessToken, signRefreshToken, verifyRefreshToken } from "../services/authService";

const REFRESH_COOKIE = "portify_refresh";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const existing = await User.findOne({ email: input.email });
  if (existing) throw AppError.conflict("An account with this email already exists");

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({ name: input.name, email: input.email, passwordHash });

  const payload = { sub: String(user._id), email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  setRefreshCookie(res, refreshToken);

  res.status(201).json({ success: true, data: { user: user.toJSON(), accessToken } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const user = await User.findOne({ email: input.email });
  if (!user) throw AppError.unauthorized("Invalid email or password");

  const valid = await user.comparePassword(input.password);
  if (!valid) throw AppError.unauthorized("Invalid email or password");

  const payload = { sub: String(user._id), email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  setRefreshCookie(res, refreshToken);

  res.json({ success: true, data: { user: user.toJSON(), accessToken } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw AppError.unauthorized("Missing refresh token");

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw AppError.unauthorized("Invalid or expired refresh token");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw AppError.unauthorized("User no longer exists");

  const newPayload = { sub: String(user._id), email: user.email };
  const accessToken = signAccessToken(newPayload);
  const refreshToken = signRefreshToken(newPayload);
  setRefreshCookie(res, refreshToken);

  res.json({ success: true, data: { user: user.toJSON(), accessToken } });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
  res.json({ success: true, data: { ok: true } });
});

export const me = asyncHandler(async (req: Request & { user?: { id: string } }, res: Response) => {
  const user = await User.findById(req.user?.id);
  if (!user) throw AppError.notFound("User not found");
  res.json({ success: true, data: { user: user.toJSON() } });
});
