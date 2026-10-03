import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";
import { AppError } from "../utils/AppError";
import { parseResume } from "../services/resumeService";

export const uploadResume = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) throw AppError.notFound("No resume file uploaded");

  const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowed.includes(file.mimetype)) {
    throw new AppError("Only PDF or DOCX resumes are supported", 400, "UNSUPPORTED_FILE_TYPE");
  }

  const result = await parseResume(file.buffer, file.mimetype);
  res.json({ success: true, data: result });
});
