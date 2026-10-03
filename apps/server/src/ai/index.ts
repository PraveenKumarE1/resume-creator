import { env } from "../config/env";
import { AiProvider } from "./AiProvider";
import { MockAiProvider } from "./providers/MockAiProvider";
import { OpenAiProvider } from "./providers/OpenAiProvider";

let provider: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (provider) return provider;
  provider = env.aiProvider === "openai" ? new OpenAiProvider() : new MockAiProvider();
  return provider;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  rewrite_professional: "Rewrite the following text in a clear, confident, professional tone for a portfolio.",
  shorten: "Shorten the following text while keeping the key meaning.",
  expand: "Expand the following text with more specific, concrete detail.",
  fix_grammar: "Fix grammar and punctuation in the following text without changing its meaning.",
  generate_tagline: "Write a short, punchy one-line tagline based on the following context.",
  generate_about: "Write a compelling 'About me' paragraph for a portfolio based on the following context.",
  generate_project_description: "Write a concise, results-oriented project description based on the following context.",
  generate_skill_list: "Normalize the following into a clean comma-separated skill list.",
  generate_experience_bullets: "Turn the following into 3-5 concise, achievement-oriented bullet points.",
  suggest_headline: "Suggest a strong professional headline based on the following context.",
  improve_tone: "Improve the tone of the following text to sound more confident and polished.",
  generate_service_description: "Write a short, persuasive description of this service offering.",
  generate_achievement: "Write a concise, impressive description of this achievement.",
  custom: "Help the user with their portfolio content based on the following request.",
};

export async function runAiAction(action: string, input: string): Promise<string> {
  const system = SYSTEM_PROMPTS[action] ?? SYSTEM_PROMPTS.custom;
  return getAiProvider().generate({ system, prompt: input });
}
