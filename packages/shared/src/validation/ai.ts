import { z } from "zod";

export const aiActionEnum = z.enum([
  "rewrite_professional",
  "shorten",
  "expand",
  "fix_grammar",
  "generate_tagline",
  "generate_about",
  "generate_project_description",
  "generate_skill_list",
  "generate_experience_bullets",
  "suggest_headline",
  "improve_tone",
  "generate_service_description",
  "generate_achievement",
  "custom",
]);

export const aiRequestSchema = z.object({
  action: aiActionEnum,
  input: z.string().min(1).max(4000),
  context: z.record(z.unknown()).optional(),
});

export type AiRequestInput = z.infer<typeof aiRequestSchema>;
