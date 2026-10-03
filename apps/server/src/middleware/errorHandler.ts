import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, error: { message: "Route not found", code: "NOT_FOUND" } });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) fields[issue.path.join(".")] = issue.message;
    return res.status(400).json({
      success: false,
      error: { message: "Validation failed", code: "VALIDATION_ERROR", fields },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code, fields: err.fields },
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    error: { message: "Something went wrong. Please try again.", code: "INTERNAL_ERROR" },
  });
}
